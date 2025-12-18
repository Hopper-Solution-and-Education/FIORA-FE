import { FilterCriteria } from '@/shared/types';
import { Wallet } from '../domain/entity/Wallet';
import { WalletFilterParams } from '../presentation/types/filter.type';

/**
 * Extracts walletTypes, balanceMin, and balanceMax from filterCriteria.
 * Allows passing minRange/maxRange for default fallback.
 */
export function extractWalletFilterData(
  filterCriteria: FilterCriteria,
  minRange: number,
  maxRange: number,
): WalletFilterParams {
  let walletTypes: string[] = [];
  let balanceMin = minRange;
  let balanceMax = maxRange;
  const filters = (filterCriteria.filters as { [key: string]: unknown }) || {};
  if (
    filters.type &&
    typeof filters.type === 'object' &&
    Array.isArray((filters.type as { in?: string[] }).in)
  ) {
    walletTypes = (filters.type as { in: string[] }).in;
  }

  if (filters.balance && typeof filters.balance === 'object') {
    const balance = filters.balance as { gte?: number; lte?: number };
    if (typeof balance.gte === 'number') balanceMin = balance.gte;
    if (typeof balance.lte === 'number') balanceMax = balance.lte;
  }
  return { walletTypes, balanceMin, balanceMax };
}

/**
 * Creates the filter structure for API/query from WalletFilterParams.
 * Only includes type and balance if they differ from defaults.
 */
export function createWalletFilterStructure(
  params: WalletFilterParams,
  minRange: number,
  maxRange: number,
): Record<string, object> {
  const result: Record<string, object> = {};
  if (params.walletTypes.length > 0) {
    result.type = { in: params.walletTypes };
  }
  if (params.balanceMin !== minRange || params.balanceMax !== maxRange) {
    result.balance = { gte: params.balanceMin, lte: params.balanceMax };
  }
  return result;
}

/**
 * Filters wallets by filters and search string.
 */
export function filterWallets(
  wallets: Wallet[],
  filters: Record<string, unknown>,
  search?: string,
): Wallet[] {
  return wallets.filter((w) => {
    const matchSearch =
      !search ||
      (w.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (w.type || '').toLowerCase().includes(search.toLowerCase());
    let matchType = true;
    const typeFilter = filters.type as { in?: string[] };
    if (typeFilter && Array.isArray(typeFilter.in)) {
      matchType = typeFilter.in.includes(w.type);
    }
    let matchMin = true;
    let matchMax = true;
    const balanceFilter = filters.balance as { gte?: number; lte?: number };
    if (balanceFilter) {
      if (typeof balanceFilter.gte === 'number') matchMin = w.frBalanceActive >= balanceFilter.gte;
      if (typeof balanceFilter.lte === 'number') matchMax = w.frBalanceActive <= balanceFilter.lte;
    }
    return matchSearch && matchType && matchMin && matchMax;
  });
}
