import { AttachmentData } from '@/features/setting/api/types/attachmentTypes';
import { _PaginationResponse, HttpResponse } from '@/shared/types';
import { FilterObject } from '@/shared/types/filter.types';
import { DepositRequestStatus } from '../../domain';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export interface IWalletSettingApi {
  getDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<_PaginationResponse<GetDepositRequestResponse>>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
    attachmentData?: AttachmentData,
  ): Promise<HttpResponse<UpdateDepositRequestStatusResponse>>;
}
