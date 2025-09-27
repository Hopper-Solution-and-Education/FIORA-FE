import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { notificationUseCase } from '@/features/notification/application/use-cases/notificationUseCase';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { CURRENCY, DEFAULT_BASE_CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { BadRequestError, NotFoundError } from '@/shared/lib';
import { FilterObject } from '@/shared/types/filter.types';
import { SessionUser } from '@/shared/types/session';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { generateRefCode } from '@/shared/utils/stringHelper';
import {
  DepositRequestStatus,
  NotificationType,
  Prisma,
  TransactionType,
  WalletType,
} from '@prisma/client';
import { ATTACHMENT_CONSTANTS } from '../../../data/module/attachment/constants/attachmentConstants';
import {
  DEFAULT_WALLET_FIELDS,
  DEPOSIT_APPROVED_EMAIL_TEMPLATE_ID,
  DEPOSIT_REJECTED_EMAIL_TEMPLATE_ID,
  MAX_REF_CODE_ATTEMPTS,
  WALLET_TYPE_ICONS,
} from '../../../data/module/wallet/constants';
import { WalletApproveEmailPart, WalletRejectEmailPart } from '../../../data/module/wallet/types';
import { attachmentRepository } from '../../infrastructure/repositories/attachmentRepository';
import { currencySettingRepository } from '../../infrastructure/repositories/currencySettingRepository';
import { walletRepository } from '../../infrastructure/repositories/walletRepository';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';
import { ICurrencySettingRepository } from '../../repositories/currencySettingRepository.interface';
import { IWalletRepository } from '../../repositories/walletRepository.interface';
import { AttachmentData } from '../../types/attachmentTypes';
import { userUseCase } from './userUsecase';

class WalletUseCase {
  constructor(
    private _walletRepository: IWalletRepository = walletRepository,
    private _attachmentRepository: IAttachmentRepository = attachmentRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
    private _accountRepository: IAccountRepository = accountRepository,
    private _currencyRepository: ICurrencySettingRepository = currencySettingRepository,
    private _userUseCase = userUseCase,
    private _notificationUsecase = notificationUseCase,
  ) {}

  async createWallet(data: Prisma.WalletUncheckedCreateInput) {
    return this._walletRepository.createWallet(data);
  }

  async getWalletByType(type: WalletType, userId: string) {
    return this._walletRepository.findWalletByType(type, userId);
  }

  async getAllWalletsByUser(userId: string) {
    const allTypes = Object.values(WalletType);
    const wallets = await this._walletRepository.findAllWalletsByUser(userId);
    const existingTypes = wallets.map((w) => w.type);

    const missingTypes = allTypes.filter((type) => !existingTypes.includes(type));

    const createdWallets = await Promise.all(
      missingTypes.map((type) =>
        this._walletRepository.createWallet({
          userId,
          type,
          icon: WALLET_TYPE_ICONS[type],
          ...DEFAULT_WALLET_FIELDS,
        }),
      ),
    );

    return [...wallets, ...createdWallets];
  }

  async getAllPackageFX() {
    return this._walletRepository.findAllPackageFX();
  }

  async getPackageFXPaginated({
    sortBy,
    page,
    limit,
  }: {
    sortBy?: Record<string, 'asc' | 'desc'>;
    page?: number;
    limit?: number;
  }) {
    return this._walletRepository.findPackageFXPaginated({ sortBy, page, limit });
  }
  async createPackageFx(data: {
    fxAmount: number;
    files?: Array<{ url: string; size: number; path: string; type: string }>;
    createdBy?: string;
  }) {
    let attachment_id: string[] = [];
    if (data.files && data.files.length > 0) {
      try {
        const attachments: Array<{ id: string }> = await Promise.all(
          data.files.map((file) => {
            return this._attachmentRepository.createAttachment({
              type: file.type,
              url: file.url,
              path: file.path,
              size: file.size,
              createdBy: data.createdBy || null,
            });
          }),
        );
        attachment_id = attachments.map((att) => att.id);
      } catch (err) {
        console.error('Error creating attachments:', err);
        throw err;
      }
    }
    try {
      const packageFXData = {
        fxAmount: data.fxAmount,
        attachment_id,
        createdBy: data.createdBy || null,
      };
      const result = await this._walletRepository.createPackageFX(packageFXData);
      return result;
    } catch (err) {
      console.error('Error creating PackageFX:', err);
      throw err;
    }
  }

  async updatePackageFX(
    id: string,
    data: {
      fxAmount: number;
      newFiles?: Array<{ url: string; size: number; path: string; type: string }>;
      removeAttachmentIds?: string[];
    },
  ) {
    const found = await this._walletRepository.getPackageFXById(id);
    if (!found) return null;

    const depositRequests = await this._walletRepository.findDepositRequestsByPackageFXId(id);
    if (depositRequests.some((req) => req.status === 'Requested')) {
      throw new BadRequestError(Messages.PACKAGE_FX_HAS_ACTIVE_DEPOSIT_REQUEST);
    }

    // Xử lý giữ lại các attachment cũ nếu không bị remove
    const existingAttachmentIds = (found.attachment_id || []).filter(
      (id) => !data.removeAttachmentIds?.includes(id),
    );

    // Upload file mới nếu có
    let newAttachmentIds: string[] = [];
    if (data.newFiles && data.newFiles.length > 0) {
      const newAttachments = await Promise.all(
        data.newFiles.map((file) =>
          this._attachmentRepository.createAttachment({
            type: file.type,
            url: file.url,
            path: file.path,
            size: file.size,
            createdBy: found.createdBy || null,
          }),
        ),
      );
      newAttachmentIds = newAttachments.map((att) => att.id);
    }

    const mergedAttachments = [...existingAttachmentIds, ...newAttachmentIds].slice(0, 3); // optional limit

    const updateData = {
      fxAmount: data.fxAmount,
      attachment_id: mergedAttachments,
    };

    return this._walletRepository.updatePackageFX(id, updateData);
  }

  async deletePackageFX(id: string) {
    const found = await this._walletRepository.getPackageFXById(id);
    if (!found) throw new NotFoundError(Messages.PACKAGE_FX_NOT_FOUND);
    const depositRequests = await this._walletRepository.findDepositRequestsByPackageFXId(id);
    if (depositRequests.length > 0) {
      const hasActiveRequests = depositRequests.some((req: any) => req.status === 'Requested');
      if (hasActiveRequests) {
        throw new BadRequestError(Messages.PACKAGE_FX_HAS_ACTIVE_DEPOSIT_REQUEST);
      }
    }
    return this._walletRepository.deletePackageFX(id);
  }

  async getDepositRequestsByType(userId: string, type: DepositRequestStatus) {
    return this._walletRepository.findDepositRequestsByType(userId, type);
  }

  async createDepositRequest(
    userId: string,
    packageFXId: string,
    refCode: string,
    attachmentData?: AttachmentData,
    currency?: string,
    user?: SessionUser,
  ) {
    // get user wallet
    const userWallet = await this._walletRepository.findWalletByType(WalletType.Payment, userId);
    if (!userWallet) {
      throw new BadRequestError(Messages.USER_WALLET_NOT_FOUND);
    }

    const packageFX = await this._walletRepository.getPackageFXById(packageFXId);
    if (!packageFX) {
      throw new NotFoundError('PackageFX not found');
    }

    let attachmentId: string | undefined;

    // Create attachment if attachment data is provided
    if (attachmentData) {
      // Validate attachment size
      if (attachmentData.size > ATTACHMENT_CONSTANTS.MAX_FILE_SIZE) {
        throw new BadRequestError(
          `File size exceeds maximum limit of ${ATTACHMENT_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
        );
      }

      const attachment = await this._attachmentRepository.createAttachment({
        type: attachmentData.type || ATTACHMENT_CONSTANTS.TYPES.DEPOSIT_PROOF,
        size: attachmentData.size || ATTACHMENT_CONSTANTS.DEFAULT_SIZE,
        url: attachmentData.url,
        path: attachmentData.path,
        createdBy: userId,
      });
      attachmentId = attachment.id;
    }

    const foundCurrency = await this._currencyRepository.findFirstCurrency({
      name: currency,
    });
    if (!foundCurrency) throw new BadRequestError(Messages.CURRENCY_NOT_FOUND);

    const depositRequest = await this._walletRepository.createDepositRequest({
      userId,
      packageFXId,
      refCode,
      attachmentId,
      status: 'Requested',
      createdBy: userId,
      currency: foundCurrency.name,
    });

    const depositBoxNotification = {
      title: 'New Deposit Request',
      type: 'DEPOSIT_REQUEST',
      notifyTo: NotificationType.ROLE_ADMIN,
      message: `User ${user?.name || user?.email || 'Unknown'} has submitted a new deposit request.`,
      deepLink: RouteEnum.DepositFX,
      attachmentId: attachmentId || undefined,
    };

    // Create notification for Admin role
    await this._notificationUsecase.createBoxNotification(depositBoxNotification);

    // Create notification for CS role
    await this._notificationUsecase.createBoxNotification({
      ...depositBoxNotification,
      notifyTo: NotificationType.ROLE_CS,
    });

    return depositRequest;
  }

  async createDepositRequestWithUniqueRefCode(
    userId: string,
    packageFXId: string,
    attachmentData?: AttachmentData,
    currency?: string,
    user?: SessionUser,
  ) {
    let refCode = '';
    let attempts = 0;

    do {
      refCode = generateRefCode(6);

      attempts++;
      if (attempts > MAX_REF_CODE_ATTEMPTS) {
        throw new BadRequestError(Messages.COULD_NOT_GENERATE_UNIQUE_REF_CODE);
      }
    } while (await this._walletRepository.isDepositRefCodeExists(refCode));

    return this.createDepositRequest(userId, packageFXId, refCode, attachmentData, currency, user);
  }

  async getTotalRequestedDepositAmount(userId: string) {
    const requests = await this._walletRepository.findDepositRequestsByType(
      userId,
      DepositRequestStatus.Requested,
    );

    const packageFXIds = requests.map((r) => r.packageFXId);

    const uniquePackageFXIds = [...new Set(packageFXIds)];

    if (uniquePackageFXIds.length === 0) return 0;

    const packageFXs = await this._walletRepository.findManyPackageFXByIds(uniquePackageFXIds);

    // Count occurrences of each packageFXId
    const packageFXCounts = packageFXIds.reduce(
      (acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Calculate total with counts
    const total = packageFXs.reduce((sum, fx) => {
      const count = packageFXCounts[fx.id] || 0;
      const amount = Number(fx.fxAmount || 0) * count;
      return sum + amount;
    }, 0);

    return total;
  }

  async getDepositRequestsPaginated(page: number, pageSize: number, filter?: FilterObject) {
    const { items, total } = await this._walletRepository.getDepositRequestsPaginated(
      page,
      pageSize,
      filter,
    );

    return {
      items,
      page,
      pageSize,
      totalPage: Math.ceil(total / pageSize),
      total,
    };
  }

  async updateDepositRequestStatus(
    id: string,
    newStatus: DepositRequestStatus,
    remark?: string,
    currency: string = 'VND',
  ) {
    const depositRequest = await this._walletRepository.findDepositRequestById(id);

    if (!depositRequest) return null;

    // Precompute values during Approve branch to avoid duplicate queries later (notifications)
    let precomputedFxAmount: number | undefined;
    if (newStatus === DepositRequestStatus.Approved) {
      // Guard: only allow Approve when current status is Requested (pending)
      this.validateStatusTransition(depositRequest.status, newStatus);

      const { userId, packageFXId } = depositRequest;
      const packageFX = await this._walletRepository.getPackageFXById(packageFXId);
      if (!packageFX) throw new NotFoundError(Messages.PACKAGE_FX_NOT_FOUND);

      const amount = Number(packageFX.fxAmount);
      precomputedFxAmount = amount;
      const txCurrency = await this.getTransactionCurrency(id, depositRequest.currency, currency);
      const paymentAccount = await this.ensurePaymentAccount(userId);
      const paymentWallet = await this.ensurePaymentWallet(userId);

      await this.createApprovalTransfers({
        userId,
        amount,
        txCurrency,
        paymentAccountId: paymentAccount.id,
        paymentAccountCurrency: paymentAccount.currency!,
        paymentWalletId: paymentWallet.id,
      });
    }

    // Persist new status last, after side effects succeed (transaction + balances)
    const updatedDepositRequest = await this._walletRepository.updateDepositRequestStatus(
      id,
      newStatus,
      remark,
    );

    await this.notifyDepositStatus(depositRequest, newStatus, remark, precomputedFxAmount);

    return updatedDepositRequest;
  }

  // private helper
  // Ensure state transition is valid according to business rules
  private validateStatusTransition(
    currentStatus: DepositRequestStatus,
    newStatus: DepositRequestStatus,
  ) {
    if (
      newStatus === DepositRequestStatus.Approved &&
      currentStatus !== DepositRequestStatus.Requested
    ) {
      throw new BadRequestError('Deposit request is not in pending status');
    }
  }

  // Idempotently ensure there is a root Payment Account for the user (create if missing)
  private async ensurePaymentAccount(userId: string) {
    let paymentAccount = await this._accountRepository.findByCondition({
      userId,
      type: 'Payment',
      parentId: null,
    });

    if (!paymentAccount) {
      paymentAccount = await this._accountRepository.create({
        userId,
        type: 'Payment',
        currency: 'VND',
        name: 'Payment Account',
        icon: 'dollarSign',
        balance: 0,
      });
    }

    return paymentAccount;
  }

  // Idempotently ensure there is a Payment Wallet for the user (create if missing)
  private async ensurePaymentWallet(userId: string) {
    let paymentWallet = await this._walletRepository.findWalletByType(WalletType.Payment, userId);

    if (!paymentWallet) {
      paymentWallet = await this._walletRepository.createWallet({
        userId,
        type: WalletType.Payment,
        icon: WALLET_TYPE_ICONS[WalletType.Payment],
        ...DEFAULT_WALLET_FIELDS,
      });
    }

    return paymentWallet;
  }

  // Resolve transaction currency: update DB if missing, normalize 'FX' -> 'USD'
  private async getTransactionCurrency(
    depositRequestId: string,
    existingCurrency: string | null | undefined,
    fallbackCurrency: string | undefined,
  ) {
    if (!existingCurrency && fallbackCurrency) {
      await this._walletRepository.updateDepositRequestCurrency(depositRequestId, fallbackCurrency);
    }
    let txCurrency = existingCurrency || fallbackCurrency;

    if (!txCurrency) throw new BadRequestError(Messages.CURRENCY_IS_REQUIRED);
    if (txCurrency === 'FX') txCurrency = 'USD';

    return txCurrency;
  }

  // Execute money movement for approval: create transaction, deduct account, increase wallet
  private async createApprovalTransfers({
    userId,
    amount,
    txCurrency,
    paymentAccountId,
    paymentAccountCurrency,
    paymentWalletId,
  }: {
    userId: string;
    amount: number;
    txCurrency: string;
    paymentAccountId: string;
    paymentAccountCurrency: string;
    paymentWalletId: string;
  }) {
    const baseTransactionAmount = await convertCurrency(amount, DEFAULT_BASE_CURRENCY, CURRENCY.FX);
    const amountConvert = await convertCurrency(amount, DEFAULT_BASE_CURRENCY, txCurrency);

    await this._transactionRepository.createTransaction({
      userId,
      fromAccountId: paymentAccountId,
      toWalletId: paymentWalletId,
      amount: amountConvert,
      currency: txCurrency,
      type: TransactionType.Transfer,
      createdBy: userId,
      baseAmount: baseTransactionAmount,
      baseCurrency: DEFAULT_BASE_CURRENCY,
      remark: `Deposit request approved`,
      isMarked: true,
    });

    const deductAmount = await convertCurrency(amount, CURRENCY.USD, paymentAccountCurrency);

    if (deductAmount > 0) {
      await this._accountRepository.update(paymentAccountId, {
        balance: { decrement: deductAmount },
        baseAmount: { decrement: amount },
        baseCurrency: DEFAULT_BASE_CURRENCY,
        updatedBy: userId,
      });
    }

    await this._walletRepository.increaseWalletBalance(paymentWalletId, amount);
  }

  // Notify user via in-app + email template (reuses precomputed FX amount when available)
  private async notifyDepositStatus(
    depositRequest: { userId: string; packageFXId: string },
    newStatus: DepositRequestStatus,
    remark?: string,
    precomputedFxAmount?: number,
  ) {
    const userInfo = await this._userUseCase.getUserById(depositRequest.userId);
    if (!userInfo) return;

    const userEmail = userInfo.email;
    const recipient = userEmail;
    const displayName = userInfo.name || userEmail;

    const fxAmount =
      precomputedFxAmount ??
      Number(
        (await this._walletRepository.getPackageFXById(depositRequest.packageFXId))?.fxAmount || 0,
      );

    if (newStatus === DepositRequestStatus.Approved) {
      await this._notificationUsecase.createBoxNotification({
        title: 'Deposit Request Approved',
        type: 'DEPOSIT_APPROVED',
        notifyTo: NotificationType.PERSONAL,
        message: `Your deposit request has been approved successfully.`,
        deepLink: RouteEnum.WalletDashboard,
        emails: [userInfo.email],
      });

      const emailPart: WalletApproveEmailPart = {
        user_id: depositRequest.userId,
        recipient,
        user_name: displayName,
        user_email: userEmail,
        fx_amount: fxAmount,
      };

      await this._notificationUsecase.sendNotificationWithTemplate(
        DEPOSIT_APPROVED_EMAIL_TEMPLATE_ID,
        [emailPart],
        NotificationType.PERSONAL,
        'DEPOSIT_APPROVED',
        'Deposit Request Approved',
      );
    } else if (newStatus === DepositRequestStatus.Rejected) {
      await this._notificationUsecase.createBoxNotification({
        title: 'Deposit Request Rejected',
        type: 'DEPOSIT_REJECTED',
        notifyTo: NotificationType.PERSONAL,
        message: `Your deposit request has been rejected. ${remark ? `Reason: ${remark}` : ''}`,
        deepLink: RouteEnum.WalletDashboard,
        emails: [userInfo.email],
      });

      const emailPart: WalletRejectEmailPart = {
        user_id: depositRequest.userId,
        recipient,
        user_name: displayName,
        user_email: userEmail,
        fx_amount: fxAmount,
        rejection_reason: remark || 'No reason provided',
      };

      await this._notificationUsecase.sendNotificationWithTemplate(
        DEPOSIT_REJECTED_EMAIL_TEMPLATE_ID,
        [emailPart],
        NotificationType.PERSONAL,
        'DEPOSIT_REJECTED',
        'Deposit Request Rejected',
      );
    }
  }
}

export const walletUseCase = new WalletUseCase();
