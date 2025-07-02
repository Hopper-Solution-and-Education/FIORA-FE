import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';
import type { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import type { PackageFXResponse } from '../dto/response/PackageFXResponse';
import type { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';
import { DepositRequestStatus } from '../../domain/enum';
import { _PaginationResponse } from '@/shared/types';

export interface IWalletApi {
  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse>;
  getAllWallets(): Promise<WalletsResponse>;
  getDepositRequestsByType(type: string): Promise<DepositRequestResponse>;
  getAllPackageFX(): Promise<PackageFXResponse>;
  createDepositRequest(data: CreateDepositRequestDto): Promise<DepositRequestResponse>;
  getFrozenDepositAmount(): Promise<{
    status: number;
    message: string;
    data: { amount: number };
  }>;
  getDepositRequestsPaginated(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<_PaginationResponse<DepositRequestResponse>>;
}
