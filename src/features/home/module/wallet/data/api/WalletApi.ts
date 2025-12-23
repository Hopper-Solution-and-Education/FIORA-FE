import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants';
import { _PaginationResponse, Currency } from '@/shared/types';
import { routeConfig } from '@/shared/utils/route';
import { inject, injectable } from 'inversify';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { DepositRequestStatus } from '../../domain/enum';
import type { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';
import type { GetPackageFXPaginatedRequest } from '../dto/request/GetPackageFXPaginatedRequest';
import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import type { PackageFXPaginatedResponse } from '../dto/response/PackageFXResponse';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';
import type { IWalletApi } from './IWalletApi';

@injectable()
export class WalletApi implements IWalletApi {
  constructor(@inject(WALLET_TYPES.IHttpClient) private readonly httpClient: IHttpClient) {}

  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse> {
    return this.httpClient.get<WalletResponse>(
      routeConfig(ApiEndpointEnum.Wallet, {}, { type: request.type }),
    );
  }

  getAllWallets(): Promise<WalletsResponse> {
    return this.httpClient.get<WalletsResponse>(routeConfig(ApiEndpointEnum.Wallet));
  }

  getDepositRequestsByType(type: string): Promise<DepositRequestResponse> {
    return this.httpClient.get<DepositRequestResponse>(
      routeConfig(ApiEndpointEnum.WalletDeposit, {}, { type }),
    );
  }

  getAllPackageFX(): Promise<PackageFXPaginatedResponse> {
    return this.httpClient.get<PackageFXPaginatedResponse>(
      routeConfig(ApiEndpointEnum.WalletPackage),
    );
  }

  getPackageFXPaginated(
    request: GetPackageFXPaginatedRequest,
  ): Promise<PackageFXPaginatedResponse> {
    const queryParams: Record<string, string | number> = {};

    if (request.sortBy) {
      queryParams.sortBy = JSON.stringify(request.sortBy);
    }
    if (request.page) {
      queryParams.page = request.page;
    }
    if (request.limit) {
      queryParams.limit = request.limit;
    }
    if (request.search) {
      queryParams.search = request.search;
    }

    return this.httpClient.get<PackageFXPaginatedResponse>(
      routeConfig(ApiEndpointEnum.WalletPackage, {}, queryParams),
    );
  }

  createDepositRequest(
    data: CreateDepositRequestDto,
    currency: Currency,
  ): Promise<DepositRequestResponse> {
    return this.httpClient.post<DepositRequestResponse>(
      routeConfig(ApiEndpointEnum.WalletDeposit),
      data,
      {
        'x-user-currency': currency,
      },
    );
  }

  getFrozenDepositAmount(): Promise<{
    status: number;
    message: string;
    data: { amount: number };
  }> {
    return this.httpClient.get<{
      status: number;
      message: string;
      data: { amount: number };
    }>(routeConfig(ApiEndpointEnum.WalletFrozenAmount));
  }

  getDepositRequestsPaginated(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<_PaginationResponse<DepositRequestResponse>> {
    return this.httpClient.get<_PaginationResponse<DepositRequestResponse>>(
      routeConfig(ApiEndpointEnum.WalletSetting, {}, { userId, status, page, pageSize }),
    );
  }
}
