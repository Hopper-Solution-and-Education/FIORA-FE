import { _PaginationResponse, Currency } from '@/shared/types';
import { DepositRequestStatus } from '../../domain/enum';
import type { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';
import type { GetPackageFXPaginatedRequest } from '../dto/request/GetPackageFXPaginatedRequest';
import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import type { PackageFXPaginatedResponse } from '../dto/response/PackageFXResponse';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';

export interface IWalletApi {
  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse>;
  getAllWallets(): Promise<WalletsResponse>;
  getDepositRequestsByType(type: string): Promise<DepositRequestResponse>;
  getAllPackageFX(): Promise<PackageFXPaginatedResponse>;
  getPackageFXPaginated(request: GetPackageFXPaginatedRequest): Promise<PackageFXPaginatedResponse>;
  createDepositRequest(
    data: CreateDepositRequestDto,
    currency: Currency,
  ): Promise<DepositRequestResponse>;
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
