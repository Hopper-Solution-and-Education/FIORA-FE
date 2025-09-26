import { CURRENCY } from '@/shared/constants';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useCallback, useEffect, useState } from 'react';
import { usePaymentWalletTransactions } from '../../../hooks';
import { PaginationParams, PaymentWalletTransaction, initPaginationParams } from '../types';

// Narrow type describing the API transaction shape used by this hook.
// Keeps us from relying on `any` while avoiding over-coupling to the full backend type.
type RawTransaction = {
  id: string;
  createdAt?: string | Date | null;
  type?: string | null;
  amount?: number | null;
  currency?: string;
  description?: string;
  remark?: string;
  fromWallet?: { id?: string; name?: string; type?: string } | null;
  toWallet?: { id?: string; name?: string; type?: string } | null;
  membershipBenefit?: { id?: string; name?: string } | null;
  fromAccount?: { id?: string; name?: string } | null;
  toAccount?: { id?: string; name?: string } | null;
  fromCategory?: { id?: string; name?: string } | null;
  toCategory?: { id?: string; name?: string } | null;
};

// Utils ------------------------------------------------------------------

const withSuffix = (value?: string | null, suffix?: string) =>
  value ? `${value}${suffix ? ` ${suffix}` : ''}` : null;

const toIsoString = (value?: string | Date | null): string => {
  if (!value) return '';
  try {
    const d = typeof value === 'string' ? new Date(value) : value;
    return isNaN(d.getTime()) ? String(value) : d.toISOString();
  } catch {
    return String(value);
  }
};

const resolveFromLabel = (item: RawTransaction): string | null => {
  return (
    (item?.fromWallet?.name
      ? withSuffix(item.fromWallet.name, 'Wallet')
      : item?.fromWallet?.type
        ? withSuffix(item.fromWallet.type, 'Wallet')
        : null) ??
    item?.membershipBenefit?.name ??
    (item?.fromAccount?.name ? item.fromAccount.name : null) ??
    item?.fromCategory?.name ??
    null
  );
};

const resolveToLabel = (item: RawTransaction): string | null => {
  return (
    (item?.toWallet?.name
      ? withSuffix(item.toWallet.name, 'Wallet')
      : item?.toWallet?.type
        ? withSuffix(item.toWallet.type, 'Wallet')
        : null) ??
    (item?.toAccount?.name ? item.toAccount.name : null) ??
    item?.toCategory?.name ??
    null
  );
};

const resolveFromId = (item: RawTransaction): string | undefined =>
  item?.fromWallet?.id ??
  item?.membershipBenefit?.id ??
  item?.fromAccount?.id ??
  item?.fromCategory?.id ??
  undefined;

const resolveToId = (item: RawTransaction): string | undefined =>
  item?.toWallet?.id ?? item?.toAccount?.id ?? item?.toCategory?.id ?? undefined;

const mapTransactionsToDisplay = (
  transactions: RawTransaction[],
  startingRowNumber: number,
): PaymentWalletTransaction[] => {
  return transactions.map((item, index) => {
    const from = resolveFromLabel(item) ?? undefined;
    const to = resolveToLabel(item) ?? undefined;

    return {
      id: item.id,
      createdAt: toIsoString(item.createdAt),
      type: item.type ?? '',
      amount: item.amount ?? 0,
      from,
      fromId: resolveFromId(item),
      toId: resolveToId(item),
      to,
      remark: item.description || item.remark || 'No remark',
      currency: item.currency || CURRENCY.FX,
      rowNumber: startingRowNumber + index,
    };
  });
};

const computePaginationTotals = (
  prev: PaginationParams,
  pagination: { totalPage?: number; total?: number } | null | undefined,
  totalCount: number,
  responseLength: number,
): Pick<PaginationParams, 'totalPage' | 'totalItems'> => {
  const totalItems =
    pagination?.total !== undefined && pagination.total > 0
      ? pagination.total
      : totalCount > 0
        ? totalCount
        : responseLength;

  const totalPage =
    pagination?.totalPage !== undefined
      ? pagination.totalPage
      : Math.max(1, Math.ceil(totalItems / prev.pageSize));

  return { totalItems, totalPage };
};

export const usePaymentWalletTableData = () => {
  const {
    transactions: transactionsResponse,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    totalCount,
    pagination,
    loadMoreTransactions,
    searchTransactions,
    filterTransactions,
    filterCriteria,
  } = usePaymentWalletTransactions();

  const [displayData, setDisplayData] = useState<PaymentWalletTransaction[]>([]);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>(initPaginationParams);

  // Handle data updates
  useEffect(() => {
    if (!transactionsResponse || !Array.isArray(transactionsResponse)) return;

    setDisplayData((prevDisplayData) => {
      // If this is a fresh load (we cleared transactions before fetching), replace data
      const shouldReplace = !prevDisplayData.length || paginationParams.currentPage === 1;

      // Handle empty responses:
      // - On fresh loads (page 1), clear the table
      // - On subsequent pages, keep existing data and don't touch row numbers
      if ((transactionsResponse as RawTransaction[]).length === 0) {
        return shouldReplace ? [] : prevDisplayData;
      }

      if (shouldReplace) {
        // Fresh load: restart row numbering from 1 and render the current response
        return mapTransactionsToDisplay(transactionsResponse as RawTransaction[], 1);
      }

      // Incremental load: Only add truly new items to avoid duplicate rows
      const existingIds = new Set(prevDisplayData.map((d) => d.id));
      const newTransactions = (transactionsResponse as RawTransaction[]).filter(
        (t) => !existingIds.has(t.id),
      );

      const startingRowNumber = prevDisplayData.length + 1;
      const mappedNewData = mapTransactionsToDisplay(newTransactions, startingRowNumber);

      return [...prevDisplayData, ...mappedNewData];
    });

    // Prefer pagination values from API; fallback to computed totalCount
    setPaginationParams((prev) => ({
      ...prev,
      ...computePaginationTotals(prev, pagination, totalCount, transactionsResponse.length),
    }));
  }, [transactionsResponse, totalCount, pagination, paginationParams.currentPage]);

  // Handle search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchTransactions(searchTerm);
      setPaginationParams((prev) => ({ ...prev, currentPage: 1 }));
    },
    [searchTransactions],
  );

  // Handle filter functionality
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      filterTransactions(newFilter);
      setPaginationParams((prev) => ({ ...prev, currentPage: 1 }));
    },
    [filterTransactions],
  );

  return {
    displayData,
    paginationParams,
    setPaginationParams,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    loadMoreTransactions,
    handleSearch,
    handleFilterChange,
    filterCriteria,
  };
};
