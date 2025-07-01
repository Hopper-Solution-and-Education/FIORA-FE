import { Prisma, WalletType, DepositRequestStatus } from '@prisma/client';
import { walletRepository } from '../../infrastructure/repositories/walletRepository';
import { IWalletRepository } from '../../repositories/walletRepository.interface';
import { attachmentRepository } from '../../infrastructure/repositories/attachmentRepository';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';
import { ATTACHMENT_CONSTANTS } from '../../constants/attachmentConstants';

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
};

const DEFAULT_WALLET_FIELDS = {
  frBalanceActive: 0,
  frBalanceFrozen: 0,
  creditLimit: null,
  name: null,
  createdBy: null,
  updatedBy: null,
};

class WalletUseCase {
  constructor(
    private _walletRepository: IWalletRepository = walletRepository,
    private _attachmentRepository: IAttachmentRepository = attachmentRepository,
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
}

export const walletUseCase = new WalletUseCase();
