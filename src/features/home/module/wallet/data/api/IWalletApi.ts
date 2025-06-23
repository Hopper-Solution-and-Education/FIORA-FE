import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';

export interface IWalletApi {
  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse>;
  getAllWallets(): Promise<WalletsResponse>;
}
