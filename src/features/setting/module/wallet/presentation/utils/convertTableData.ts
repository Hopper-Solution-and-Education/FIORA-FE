import { DepositRequest } from '../../domain';
import { WalletSettingTableData } from '../types';

export const convertToTableData = (depositRequest: DepositRequest): WalletSettingTableData => ({
  ...depositRequest,
  key: depositRequest.id,
});
