import { DepositRequestStatus } from '../enum';

export type DepositRequest = {
  id: string;
  userId: string;
  refCode: string;
  packageFXId: string;
  attachmentId?: string;
  status: DepositRequestStatus;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  currency?: string;
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
};
