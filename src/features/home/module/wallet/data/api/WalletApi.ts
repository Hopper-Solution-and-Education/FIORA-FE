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
}
