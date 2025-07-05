import { DepositRequestStatus } from '../../domain/enum';
import { DepositRequestResponse } from '../dto/response/DepositRequestResponse';

export interface IWalletSettingRepository {
  getDepositRequestsPaginated(
    userId: string,
    status: DepositRequestStatus,
    page: number,
    pageSize: number,
  ): Promise<DepositRequestResponse>;
}
