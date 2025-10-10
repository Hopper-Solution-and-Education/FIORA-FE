import { _PaginationResponse } from '@/shared/types';
import { GetDepositRequestResponse } from '../dto/response/GetDepositRequestResponse';
import { UpdateDepositRequestStatusResponse } from '../dto/response/UpdateDepositRequestStatusResponse';

export class WalletSettingMapper {
  static toDepositRequestsPaginated(response: _PaginationResponse<GetDepositRequestResponse>) {
    return {
      items: response.data.items.map(this.toDepositRequest),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
      total: response.data.total,
    };
  }

  static toDepositRequest(response: GetDepositRequestResponse) {
    return {
      ...response,
      fxAmount: response.package ? Number(response.package.fxAmount) : Number(response.amount || 0),
      packageFXId: response.packageFXId || '',
      attachmentId: response.attachmentId || undefined,
      createdBy: response.createdBy || '',
      updatedBy: response.updatedBy || undefined,
    };
  }

  static toUpdateDepositRequestStatus(response: UpdateDepositRequestStatusResponse) {
    return { ...response };
  }
}
