import { DynamicFilterGroup } from '@/shared/types';
import {
  WALLET_SETTING_TABLE_COLUMN_CONFIG,
  WalletSettingTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface WalletSettingState {
  loading: boolean;
  error: string | null;
  columnConfig: WalletSettingTableColumnKeyType;
  updatingItems: string[];
  filter: DynamicFilterGroup;
  search: string;
}

/**
 * Default filter configuration for wallet settings table
 *
 * This configuration defines the standard filtering options available for
 * the wallet settings data table, including search, status, and amount range filters.
 *
 * @description Filter structure supports:
 * - Text search: CONTAINS operator for wallet name/description search
 * - Status filter: IN operator for multi-select wallet status filtering
 * - Amount range: BETWEEN operator for amount validation with min/max bounds
 *
 * @example
 * ```typescript
 * const filterConfig: DynamicFilterGroup = {
 *   condition: 'AND',
 *   rules: [
 *     {
 *       field: 'search',
 *       operator: FilterOperator.CONTAINS,
 *       value: '',
 *     },
 *     {
 *       field: 'status',
 *       operator: FilterOperator.IN,
 *       value: [],
 *     },
 *     {
 *       field: 'amount',
 *       operator: FilterOperator.BETWEEN,
 *       value: [DEFAULT_MIN_AMOUNT, DEFAULT_MAX_AMOUNT],
 *     }
 *   ]
 * };
 * ```
 */
export const initialState: WalletSettingState = {
  loading: false,
  error: null,
  columnConfig: WALLET_SETTING_TABLE_COLUMN_CONFIG,
  updatingItems: [],
  filter: {
    condition: 'AND',
    rules: [],

    // please read above note before edit this filter
  },
  search: '', // Add default value for search
};
