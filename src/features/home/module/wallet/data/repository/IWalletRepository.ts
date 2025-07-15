import { Currency } from '@/shared/types';
import { DepositRequest } from '../../domain/entity/DepositRequest';
import { PackageFX } from '../../domain/entity/PackageFX';
import { Wallet } from '../../domain/entity/Wallet';
import { WalletType } from '../../domain/enum';
import { DepositRequestStatus } from '../../domain/enum/DepositRequestStatus';
import { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';

export interface IWalletRepository {
  getWalletByType(type: WalletType): Promise<Wallet>;
  getAllWallets(): Promise<Wallet[]>;
  getDepositRequestsByType(type: DepositRequestStatus): Promise<DepositRequest[]>;
  getAllPackageFX(): Promise<PackageFX[]>;
  createDepositRequest(data: CreateDepositRequestDto, currency: Currency): Promise<DepositRequest>;
  getFrozenDepositAmount(): Promise<number>;
}
