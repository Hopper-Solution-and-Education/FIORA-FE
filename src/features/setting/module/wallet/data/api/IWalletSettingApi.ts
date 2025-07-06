import { _PaginationResponse } from '@/shared/types';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';
import { DepositRequestStatus } from '../../domain';
import { HttpResponse } from '@/shared/types';

export interface IWalletSettingApi {
  getDepositRequestsPaginated(
    page: number,
    pageSize: number,
  ): Promise<_PaginationResponse<GetDepositRequestResponse>>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
  ): Promise<HttpResponse<UpdateDepositRequestStatusResponse>>;
}
