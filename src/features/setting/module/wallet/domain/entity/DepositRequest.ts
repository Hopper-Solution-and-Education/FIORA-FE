import { DepositRequestStatus } from '../enum';

export type DepositRequest = {
  id: string;
  userId: string;
  refCode: string;
  packageFXId: string;
  attachmentId?: string;
  status: DepositRequestStatus;
  remark?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string | null;
  fxAmount: number;
  package: {
    id: string;
    fxAmount: string;
  };
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
};
