import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';
import { FilterObject } from '@/shared/types/filter.types';
import { generateRefCode } from '@/shared/utils/stringHelper';
import {
  CategoryType,
  Currency,
  DepositRequestStatus,
  Prisma,
  TransactionType,
  WalletType,
} from '@prisma/client';
import { ATTACHMENT_CONSTANTS } from '../../constants/attachmentConstants';
import { attachmentRepository } from '../../infrastructure/repositories/attachmentRepository';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { walletRepository } from '../../infrastructure/repositories/walletRepository';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';
import { ICategoryRepository } from '../../repositories/categoryRepository.interface';
import { IWalletRepository } from '../../repositories/walletRepository.interface';

interface AttachmentData {
  type: string;
  size: number;
  url: string;
  path: string;
}

// Wallet type to icon mapping
const WALLET_TYPE_ICONS: Record<WalletType, string> = {
  [WalletType.Payment]: 'dollarSign',
  [WalletType.Invest]: 'trendingUp',
  [WalletType.Saving]: 'piggyBank',
  [WalletType.Lending]: 'user',
  [WalletType.BNPL]: 'billing',
  [WalletType.Debt]: 'banknoteArrowDown',
  [WalletType.Referral]: 'userPlus',
  [WalletType.Cashback]: 'circleFadingArrowUp',
};

const DEFAULT_WALLET_FIELDS = {
  frBalanceActive: 0,
  frBalanceFrozen: 0,
  creditLimit: null,
  name: null,
  createdBy: null,
  updatedBy: null,
};

const MAX_REF_CODE_ATTEMPTS = 10;

// Category constants for Deposit FX
const DEPOSIT_FX_CATEGORY_NAME = 'Deposit FX';
const DEPOSIT_FX_CATEGORY_ICON = 'piggyBank';

class WalletUseCase {
  constructor(
    private _walletRepository: IWalletRepository = walletRepository,
    private _attachmentRepository: IAttachmentRepository = attachmentRepository,
    private _transactionRepository: ITransactionRepository = transactionRepository,
    private _categoryRepository: ICategoryRepository = categoryRepository,
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

  async getDepositRequestsByType(
    userId: string,
    type: import('@prisma/client').DepositRequestStatus,
  ) {
    return this._walletRepository.findDepositRequestsByType(userId, type);
  }

  async createDepositRequest(
    userId: string,
    packageFXId: string,
    refCode: string,
    attachmentData?: AttachmentData,
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
    });
  }

  async createDepositRequestWithUniqueRefCode(
    userId: string,
    packageFXId: string,
    attachmentData?: AttachmentData,
  ) {
    let refCode = '';
    let attempts = 0;

    do {
      refCode = generateRefCode(6);

      attempts++;
      if (attempts > MAX_REF_CODE_ATTEMPTS) {
        throw new Error('Could not generate unique refCode, please try again.');
      }
    } while (await this._walletRepository.isDepositRefCodeExists(refCode));

    return this.createDepositRequest(userId, packageFXId, refCode, attachmentData);
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

  async updateDepositRequestStatus(id: string, newStatus: DepositRequestStatus, remark?: string) {
    const depositRequest = await this._walletRepository.findDepositRequestById(id);

    if (!depositRequest) return null;

    if (newStatus === DepositRequestStatus.Approved) {
      const { userId, packageFXId } = depositRequest;
      const packageFX = await this._walletRepository.getPackageFXById(packageFXId);
      if (!packageFX) throw new Error('PackageFX not found');
      const amount = Number(packageFX.fxAmount);
      const category = await this.getOrCreateDepositFXCategory(userId);
      const toWallet = await this._walletRepository.findWalletByType('Payment', userId);

      if (!toWallet) throw new Error('Payment wallet not found');

      await this._transactionRepository.createTransaction({
        userId,
        fromCategoryId: category.id,
        toWalletId: toWallet.id,
        amount,
        currency: Currency.FX,
        type: TransactionType.Transfer,
        createdBy: userId,
      });

      await this._walletRepository.increaseWalletBalance(toWallet.id, amount);
    }

    return this._walletRepository.updateDepositRequestStatus(id, newStatus, remark);
  }

  private async getOrCreateDepositFXCategory(userId: string) {
    let category = await this._categoryRepository.findFirstCategory({
      userId,
      name: DEPOSIT_FX_CATEGORY_NAME,
    });

    if (!category) {
      category = await this._categoryRepository.createCategory({
        userId,
        type: CategoryType.Income,
        icon: DEPOSIT_FX_CATEGORY_ICON,
        name: DEPOSIT_FX_CATEGORY_NAME,
        tax_rate: 0,
        createdBy: userId,
        updatedBy: userId,
      });
    }
    return category;
  }
}

export const walletUseCase = new WalletUseCase();
