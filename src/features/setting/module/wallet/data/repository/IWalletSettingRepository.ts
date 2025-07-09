import { DepositRequestStatus } from '../../domain';
import { DepositRequestsPaginated } from '../../presentation';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export interface IWalletSettingRepository {
  getDepositRequestsPaginated(page: number, pageSize: number): Promise<DepositRequestsPaginated>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<UpdateDepositRequestStatusResponse>;
}
