import { inject, injectable } from 'inversify';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import type { IHttpClient } from '@/config';
import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { WalletResponse } from '../dto/response/WalletResponse';
import type { IWalletApi } from './IWalletApi';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';

@injectable()
export class WalletApi implements IWalletApi {
  constructor(@inject(WALLET_TYPES.IHttpClient) private readonly httpClient: IHttpClient) {}

  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse> {
    return this.httpClient.get<WalletResponse>(
      routeConfig(ApiEndpointEnum.Wallet, {}, { type: request.type }),
    );
  }
}
