import { DepositRequestStatus } from '../../domain/enum';
import { DepositRequest } from '../../domain/entity/DepositRequest';

export interface WalletSettingTableData extends DepositRequest {
  key: string;
}

export interface WalletSettingFilterProps {
  status: DepositRequestStatus | 'all';
  search: string;
}

export interface WalletSettingPaginationProps {
  current: number;
  pageSize: number;
  total: number;
}

export interface WalletSettingTableProps {
  data: WalletSettingTableData[];
  loading: boolean;
  pagination: WalletSettingPaginationProps;
  onPageChange: (page: number) => void;
  onStatusChange: (status: DepositRequestStatus | 'all') => void;
  onSearch: (search: string) => void;
}

export interface WalletSettingActionProps {
  record: WalletSettingTableData;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
}
