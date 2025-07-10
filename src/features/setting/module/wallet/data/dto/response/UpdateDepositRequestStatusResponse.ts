import { DepositRequestStatus } from '../../../domain';

export interface UpdateDepositRequestStatusResponse {
  id: string;
  status: DepositRequestStatus;
}
