import { DepositRequestStatus } from '../../../domain/enum';

export type GetDepositRequestDto = {
  type: DepositRequestStatus;
};
