import { DepositRequestStatus, FXRequestType } from '../../../domain';

export interface GetDepositRequestResponse {
  id: string;
  userId: string;
  refCode: string;
  packageFXId: string | null;
  attachmentId?: string | null;
  status: DepositRequestStatus;
  type: FXRequestType;
  remark?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy?: string | null;
  currencyId?: string | null;
  currency?: string | null;
  amount?: string;
  package?: {
    id: string;
    fxAmount: string;
  } | null;
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  attachment?: {
    id: string;
    type: string;
    size: string;
    url: string;
    path: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string | null;
    notificationId: string | null;
  } | null;
}
