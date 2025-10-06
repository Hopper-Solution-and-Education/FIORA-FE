import { DepositRequestStatus, FXRequestType } from '../../../domain';

export interface GetDepositRequestResponse {
  id: string;
  userId: string;
  refCode: string;
  packageFXId: string;
  attachmentId?: string;
  status: DepositRequestStatus;
  type: FXRequestType;
  remark?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string | null;
  package: {
    id: string;
    fxAmount: string;
  };
}
