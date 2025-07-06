import { DepositRequestsPaginated } from '../../presentation';
import { DepositRequestStatus } from '../../domain';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export interface IWalletSettingRepository {
  getDepositRequestsPaginated(page: number, pageSize: number): Promise<DepositRequestsPaginated>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
  ): Promise<UpdateDepositRequestStatusResponse>;
}
