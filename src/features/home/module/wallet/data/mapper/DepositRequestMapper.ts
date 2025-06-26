import { DepositRequest } from '../../domain/entity/DepositRequest';
import { DepositRequestResponse } from '../dto/response/DepositRequestResponse';

export class DepositRequestMapper {
  static toDepositRequest(response: DepositRequest): DepositRequest {
    return {
      ...response,
    };
  }

  static toDepositRequests(response: DepositRequestResponse): DepositRequest[] {
    const { data } = response;
    if (Array.isArray(data)) {
      return data.map((item) => DepositRequestMapper.toDepositRequest(item));
    }
    return [DepositRequestMapper.toDepositRequest(data)];
  }
}
