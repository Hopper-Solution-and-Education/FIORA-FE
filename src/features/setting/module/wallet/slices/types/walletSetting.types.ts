import { DepositRequestStatus } from '../../domain/enum';
import { WalletSettingTableData } from '../../presentation/types';

export interface WalletSettingState {
  data: WalletSettingTableData[];
  loading: boolean;
  error: string | null;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status: DepositRequestStatus | 'all';
    search: string;
  };
  selectedItem: WalletSettingTableData | null;
  showForm: boolean;
}

export interface FetchDepositRequestsPayload {
  userId: string;
  status: DepositRequestStatus | 'all';
  page: number;
  pageSize: number;
}

export interface UpdateRequestStatusPayload {
  id: string;
  status: DepositRequestStatus;
  remark?: string;
}
