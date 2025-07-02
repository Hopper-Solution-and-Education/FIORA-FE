import { inject, injectable } from 'inversify';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import type { IHttpClient } from '@/config';
import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';
import type { IWalletApi } from './IWalletApi';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import type { PackageFXResponse } from '../dto/response/PackageFXResponse';
import type { CreateDepositRequestDto } from '../dto/request/CreateDepositRequestDto';
import { DepositRequestStatus } from '../../domain/enum';
import { _PaginationResponse } from '@/shared/types';

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

  getAllPackageFX(): Promise<PackageFXResponse> {
    return this.httpClient.get<PackageFXResponse>(routeConfig(ApiEndpointEnum.WalletPackage));
  }

  createDepositRequest(data: CreateDepositRequestDto): Promise<DepositRequestResponse> {
    return this.httpClient.post<DepositRequestResponse>(
      routeConfig(ApiEndpointEnum.WalletDeposit),
      data,
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
