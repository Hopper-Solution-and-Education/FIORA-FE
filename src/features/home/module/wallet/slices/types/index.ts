import type { FilterCriteria } from '@/shared/types/filter.types';
import type { PackageFX } from '../../domain/entity/PackageFX';
import type { Wallet } from '../../domain/entity/Wallet';
import type { WalletType } from '../../domain/enum';
import type { AttachmentData } from '../../presentation/types/attachment.type';

export interface WalletState {
  wallets: Wallet[] | null;
  loading: boolean;
  error: string | null;
  selectedWalletType: WalletType | null;
  filterCriteria: FilterCriteria;
  minBalance: number | null;
  maxBalance: number | null;
  packageFX: PackageFX[] | null;
  selectedPackageId: string | null;
  attachmentData: AttachmentData | null;
  depositSearch: string | null;
  frozenAmount: number | null;
  isShowWithdrawFXForm: boolean;
}

export const initialWalletState: WalletState = {
  wallets: [],
  loading: false,
  error: null,
  selectedWalletType: null,
  filterCriteria: { userId: '', filters: {} },
  minBalance: null,
  maxBalance: null,
  packageFX: [],
  selectedPackageId: null,
  attachmentData: null,
  depositSearch: null,
  frozenAmount: null,
  isShowWithdrawFXForm: false,
};

export interface GetWalletRequest {
  type: WalletType;
}

export interface GetWalletSuccess {
  wallets: Wallet[];
}

export interface GetWalletFailure {
  error: string;
}
