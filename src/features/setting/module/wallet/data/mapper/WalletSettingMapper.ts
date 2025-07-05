import { DepositRequestResponse } from '../dto/response/DepositRequestResponse';

export class WalletSettingMapper {
  static toDepositRequestsPaginated(response: DepositRequestResponse) {
    return {
      items: response.data.items,
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
      total: response.data.total,
    };
  }
}
