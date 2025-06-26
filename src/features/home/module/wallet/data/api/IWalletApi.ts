import type { GetWalletByTypeRequest } from '../dto/request/GetWalletRequest';
import type { WalletResponse, WalletsResponse } from '../dto/response/WalletResponse';
import type { DepositRequestResponse } from '../dto/response/DepositRequestResponse';
import type { PackageFXResponse } from '../dto/response/PackageFXResponse';

export interface IWalletApi {
  getWalletByType(request: GetWalletByTypeRequest): Promise<WalletResponse>;
  getAllWallets(): Promise<WalletsResponse>;
  getDepositRequestsByType(type: string): Promise<DepositRequestResponse>;
  getAllPackageFX(): Promise<PackageFXResponse>;
}
