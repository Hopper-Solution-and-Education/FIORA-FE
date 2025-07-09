import { _PaginationResponse, HttpResponse } from '@/shared/types';
import { DepositRequestStatus } from '../../domain';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export interface IWalletSettingApi {
  getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<_PaginationResponse<GetDepositRequestResponse>>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
  ): Promise<HttpResponse<UpdateDepositRequestStatusResponse>>;
}
