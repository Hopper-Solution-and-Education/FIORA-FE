import { AttachmentData } from '@/features/setting/api/types/attachmentTypes';
import { FilterObject } from '@/shared/types/filter.types';
import { DepositRequestStatus } from '../../domain';
import { DepositRequestsPaginated } from '../../presentation';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export interface IWalletSettingRepository {
  getDepositRequestsPaginated(
    page: number,
    pageSize: number,
    filter?: FilterObject,
  ): Promise<DepositRequestsPaginated>;
  updateDepositRequestStatus(
    id: string,
    status: DepositRequestStatus,
    remark?: string,
    attachmentData?: AttachmentData,
  ): Promise<UpdateDepositRequestStatusResponse>;
}
