import { IAccountRepository } from '@/features/auth/domain/repositories/accountRepository.interface';
import { accountRepository } from '@/features/auth/infrastructure/repositories/accountRepository';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { CURRENCY } from '@/shared/constants';
import { Messages } from '@/shared/constants/message';
import { FilterObject } from '@/shared/types/filter.types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { generateRefCode } from '@/shared/utils/stringHelper';
import {
  Currency,
  DepositRequestStatus,
  Prisma,
  TransactionType,
  WalletType,
} from '@prisma/client';
import { ATTACHMENT_CONSTANTS } from '../../constants/attachmentConstants';
import {
  DEFAULT_WALLET_FIELDS,
  MAX_REF_CODE_ATTEMPTS,
  WALLET_TYPE_ICONS,
} from '../../constants/walletConstant';
import { attachmentRepository } from '../../infrastructure/repositories/attachmentRepository';
import { currencySettingRepository } from '../../infrastructure/repositories/currencySettingRepository';
import { walletRepository } from '../../infrastructure/repositories/walletRepository';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';
import { ICurrencySettingRepository } from '../../repositories/currencySettingRepository.interface';
import { IWalletRepository } from '../../repositories/walletRepository.interface';

interface AttachmentData {
  type: string;
  size: number;
  url: string;
  path: string;
}

class WalletUseCase {
  constructor(
    private _walletRepository: IWalletRepository = walletRepository,
    private _attachmentRepository: IAttachmentRepository = attachmentRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
    private _accountRepository: IAccountRepository = accountRepository,
    private _currencyRepository: ICurrencySettingRepository = currencySettingRepository,
  ) { }

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

  async createPackageFx(data: {
    fxAmount: number;
    files?: Array<{ url: string; size: number; path: string; type: string }>;
    createdBy?: string;
  }) {
    let attachment_id: string[] = [];
    if (data.files && data.files.length > 0) {
      const attachments = await Promise.all(
        data.files.map((file) =>
          this._attachmentRepository.createAttachment({
            type: file.type,
            url: file.url,
            path: file.path,
            size: file.size,
            createdBy: data.createdBy || null,
          }),
        ),
      );
      attachment_id = attachments.map((att) => att.id);
    }
    return this._walletRepository.createPackageFX({
      fxAmount: data.fxAmount,
      attachment_id,
      createdBy: data.createdBy || null,
    });
  }

  async updatePackageFX(
    id: string,
    data: {
      fxAmount: number;
      files?: Array<{ url: string; size: number; path: string; type: string }>;
      replaceAttachments?: boolean;
    },
  ) {
    const found = await this._walletRepository.getPackageFXById(id);
    if (!found) return null;

    const depositRequests = await this._walletRepository.findDepositRequestsByPackageFXId(id);
    const hasActiveRequests = depositRequests.some((req) => req.status === 'Requested');
    if (hasActiveRequests) {
      throw new Error(Messages.PACKAGE_FX_HAS_ACTIVE_DEPOSIT_REQUEST);
    }

    const updateData: { fxAmount: number; attachment_id?: string[] } = {
      fxAmount: data.fxAmount,
    };

    if (data.files && data.files.length > 0) {
      const attachments = await Promise.all(
        data.files.map((file) =>
          this._attachmentRepository.createAttachment({
            type: file.type,
            url: file.url,
            path: file.path,
            size: file.size,
            createdBy: found.createdBy || null,
          }),
        ),
      );

      updateData.attachment_id = data.replaceAttachments
        ? attachments.map((att) => att.id)
        : [...(found.attachment_id || []), ...attachments.map((att) => att.id)]; // append
    } else {
      updateData.attachment_id = found.attachment_id || [];
    }

    return this._walletRepository.updatePackageFX(id, updateData);
  }
  async deletePackageFX(id: string) {
    const found = await this._walletRepository.getPackageFXById(id);
    if (!found) return null;

    const depositRequests = await this._walletRepository.findDepositRequestsByPackageFXId(id);

    if (depositRequests.length > 0) {
      const hasActiveRequests = depositRequests.some((req: any) => req.status === 'Requested');

      if (hasActiveRequests) {
        throw new Error(
          'Cannot delete PackageFX: There are active deposit requests pending approval',
        );
      }

      console.warn(`Deleting PackageFX ${id} with ${depositRequests.length} deposit requests`);
    }

    // Gọi transaction từ repository
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
    currency?: Currency,
  ) {
    const packageFX = await this._walletRepository.getPackageFXById(packageFXId);
    if (!packageFX) {
      throw new Error('PackageFX not found');
    }

    let attachmentId: string | undefined;

    // Create attachment if attachment data is provided
    if (attachmentData) {
      // Validate attachment size
      if (attachmentData.size > ATTACHMENT_CONSTANTS.MAX_FILE_SIZE) {
        throw new Error(
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

    return this._walletRepository.createDepositRequest({
      userId,
      packageFXId,
      refCode,
      attachmentId,
      status: 'Requested',
      createdBy: userId,
      currency,
    });
  }

  async createDepositRequestWithUniqueRefCode(
    userId: string,
    packageFXId: string,
    attachmentData?: AttachmentData,
    currency?: Currency,
  ) {
    let refCode = '';
    let attempts = 0;

    do {
      refCode = generateRefCode(6);

      attempts++;
      if (attempts > MAX_REF_CODE_ATTEMPTS) {
        throw new Error(Messages.COULD_NOT_GENERATE_UNIQUE_REF_CODE);
      }
    } while (await this._walletRepository.isDepositRefCodeExists(refCode));

    return this.createDepositRequest(userId, packageFXId, refCode, attachmentData, currency);
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
    currency?: string,
  ) {
    const depositRequest = await this._walletRepository.findDepositRequestById(id);

    if (!depositRequest) return null;

    if (newStatus === DepositRequestStatus.Approved) {
      const { userId, packageFXId } = depositRequest;
      const packageFX = await this._walletRepository.getPackageFXById(packageFXId);

      if (!packageFX) throw new Error(Messages.PACKAGE_FX_NOT_FOUND);
      const amount = Number(packageFX.fxAmount);

      const foundCurrency = await this._currencyRepository.findFirstCurrency({
        name: currency,
      });

      if (!foundCurrency) throw new Error(Messages.CURRENCY_NOT_FOUND);
      // Update currency for depositRequest if not set
      if (!depositRequest.currency && currency) {
        await this._walletRepository.updateDepositRequestCurrency(id, currency);

        depositRequest.currencyId = foundCurrency.id;
      }
      let txCurrency = depositRequest.currency || currency;
      if (!txCurrency) throw new Error(Messages.CURRENCY_IS_REQUIRED);
      // If FX, treat as USD
      if (txCurrency === 'FX') txCurrency = 'USD';

      // Find root Payment Account (parentId: null, any currency)
      let paymentAccount = await this._accountRepository.findByCondition({
        userId,
        type: 'Payment',
        parentId: null,
      });
      if (!paymentAccount) {
        // Default to VND if creating new
        paymentAccount = await this._accountRepository.create({
          userId,
          type: 'Payment',
          currency: 'VND',
          name: 'Payment Account',
          icon: 'dollarSign',
          balance: 0,
        });
      }

      // create transaction from payment account (for record, still use txCurrency)
      await this._transactionRepository.createTransaction({
        userId,
        fromAccountId: paymentAccount.id,
        amount,
        currency: txCurrency,
        type: TransactionType.Transfer,
        createdBy: userId,
      });

      const deductAmount = await convertCurrency(amount, CURRENCY.USD, paymentAccount.currency!);

      if (deductAmount > 0) {
        const newBalance = Number(paymentAccount.balance ?? 0) - deductAmount;

        await this._accountRepository.update(paymentAccount.id, {
          balance: newBalance,
        });
      }

      let paymentWallet = await this._walletRepository.findWalletByType(WalletType.Payment, userId);

      if (!paymentWallet) {
        paymentWallet = await this._walletRepository.createWallet({
          userId,
          type: WalletType.Payment,
          icon: WALLET_TYPE_ICONS[WalletType.Payment],
          ...DEFAULT_WALLET_FIELDS,
        });
      }

      await this._walletRepository.increaseWalletBalance(paymentWallet.id, amount);
    }

    return this._walletRepository.updateDepositRequestStatus(id, newStatus, remark);
  }
}

export const walletUseCase = new WalletUseCase();
