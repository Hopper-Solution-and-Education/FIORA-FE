'use client';

import { Loading } from '@/components/common/atoms';
import { editFilter } from '@/components/common/filters';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { OrderType } from '@/shared/types';
import { FilterCriteria } from '@/shared/types/filter.types';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { debounce } from 'lodash';
import { FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useWindowScrollToBottom } from '../../hooks/useWindowScroll';
import { resetSavingWallet, updateFilterCriteria, updatePage } from '../../slices';
import { fetchSavingTransactions } from '../../slices/actions';
import { ISavingHistory, SavingColumn, SavingTableColumnKey, TransactionType } from '../../types';
import { DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS } from '../../utils/constants';
import { SavingTransactionTableToEntity, SavingWalletType } from '../../utils/enums';
import { formatDate } from '../../utils/formatDate';
import SavingFilterMenu from '../atoms/SavingFilterMenu';
import SavingSearch from '../atoms/SavingSearch';
import SavingSortArrowBtn from '../atoms/SavingSortArrowBtn';

function SavingTableHistory() {
  const router = useRouter();
  const { formatCurrency } = useCurrencyFormatter();
  const dispatch = useAppDispatch();
  const { visibleColumns, filterCriteria, history, loading, page, pageSize, refetchTrigger } =
    useAppSelector((state) => state.savingWallet);
  const [hoveringIdx, setHoveringIdx] = useState<number>(-1);
  const [sortTarget, setSortTarget] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<OrderType>('desc');
  const [displayData, setDisplayData] = useState<ISavingHistory[]>([]);
  const [isBottom, setIsBottom] = useState<boolean>(false);

  const handleSort = (header: string) => {
    let newSortOrder: OrderType = 'desc';

    if (sortTarget === header) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setSortTarget(header);
    setSortOrder(newSortOrder);

    handleFilterChange({ ...filterCriteria, sortBy: { [header]: newSortOrder } });
  };

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        dispatch(updatePage(1));
        handleFilterChange({ ...filterCriteria, search: String(value).trim() });
      }, 1000),

    [filterCriteria],
  );

  useEffect(() => {
    dispatch(
      fetchSavingTransactions({
        page,
        pageSize,
        filters: filterCriteria.filters ?? {},
        sortBy: filterCriteria.sortBy ?? { date: 'desc' },
        userId: filterCriteria.userId ?? '',
        search: filterCriteria.search ?? '',
      }),
    );
  }, [dispatch, filterCriteria, page, pageSize]);

  useEffect(() => {
    dispatch(
      fetchSavingTransactions({
        page: 1,
        pageSize,
        filters: filterCriteria.filters ?? {},
        sortBy: filterCriteria.sortBy ?? { date: 'desc' },
        userId: filterCriteria.userId ?? '',
        search: filterCriteria.search ?? '',
      }),
    );

    dispatch(updatePage(1));
  }, [refetchTrigger]);

  useEffect(() => {
    if (history && history.data && history.data.data) {
      if (page === 1) {
        setDisplayData([...history.data.data]);
      } else {
        setDisplayData((prev) => [...prev, ...history.data.data]);
      }
    }
  }, [history]);

  useEffect(() => {
    if (displayData.length > 0 && isBottom) {
      setIsBottom(false);
    }
  }, [displayData]);

  // UX Table Scroll
  useWindowScrollToBottom(() => {
    if (!isBottom) {
      if (history && history.data) {
        if (history.data.totalPage !== undefined && page < history.data.totalPage) {
          setIsBottom(true);
          dispatch(updatePage(page + 1));
        }
      }
    }
  }, 500);
  // UX Table Scroll end

  const tableVisibleColumns: SavingTableColumnKey = useMemo((): SavingTableColumnKey => {
    const columns =
      Object.keys(visibleColumns).length > 0
        ? Object.keys(visibleColumns)?.reduce((acc, key) => {
            if (visibleColumns[key as SavingColumn].index >= 0) {
              acc[key as SavingColumn] = visibleColumns[key as SavingColumn];
            }
            return acc;
          }, {} as SavingTableColumnKey)
        : DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS;

    return Object.fromEntries(
      Object.entries(columns)
        .sort((a, b) => a[1].index - b[1].index)
        .map(([key, value]) => [key, value]),
    ) as SavingTableColumnKey;
  }, [visibleColumns]);

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(updateFilterCriteria(newFilter));
  };

  const gotoDetailPage = (transactionId: string) => {
    if (transactionId) {
      router.push(`/transaction/details/${transactionId}`);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetSavingWallet());
      setDisplayData([]);
    };
  }, []);

  if (loading && !history && displayData.length === 0) {
    return <Loading />;
  }

  return (
    <div className={`mt-4 overflow-y-scroll scroll-smooth relative`}>
      <div className="flex flex-col items-start justify-between p-4 border border-b-0 gap-2">
        <div className="flex items-center gap-2">
          <SavingSearch callback={debouncedFilterHandler} />
          <SavingFilterMenu callBack={handleFilterChange} />
        </div>
        <Label className="text-gray-600 dark:text-gray-400 text-xs">
          Displaying{' '}
          <strong>
            {displayData?.length}/{history?.data.total}
          </strong>{' '}
          transaction records
        </Label>
      </div>
      <Table className="border-[1px]">
        <TableHeader>
          <TableRow className="font-bold text-center">
            {Object.entries(tableVisibleColumns).map(([key, value], idx) => {
              const entityKey =
                SavingTransactionTableToEntity[key as keyof typeof SavingTransactionTableToEntity];
              return (
                <TableCell
                  className={`cursor-${value.sortable ? 'pointer' : 'default'}`}
                  key={idx}
                  onMouseEnter={() => setHoveringIdx(idx)}
                  onMouseLeave={() => setHoveringIdx(-1)}
                  onClick={() => {
                    if (value.sortable) handleSort(entityKey);
                  }}
                >
                  <div
                    className={cn(
                      'w-full h-full flex justify-center items-center gap-2',
                      sortTarget === entityKey && 'text-blue-500',
                    )}
                  >
                    {key}
                    {value.sortable && (hoveringIdx === idx || sortTarget === entityKey) && (
                      <>
                        {loading ? (
                          <Loader2 color={'blue'} className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                          <SavingSortArrowBtn
                            sortOrder={sortOrder ?? 'none'}
                            isActivated={sortTarget === entityKey}
                          />
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((record: ISavingHistory, index: number) => {
            return (
              <TableRow key={record.id} className="text-center">
                <TableCell
                  className={`${
                    record.type === TransactionType.Income
                      ? 'text-green-600 dark:text-green-400'
                      : record.type === TransactionType.Expense
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  className={`cursor-pointer underline ${
                    record.type === TransactionType.Income
                      ? 'text-green-600 dark:text-green-400'
                      : record.type === TransactionType.Expense
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                  onClick={() =>
                    editFilter({
                      currentFilter: filterCriteria,
                      callBack: handleFilterChange,
                      target: 'date',
                      comparator: 'AND',
                      value: record.date.toString(),
                    })
                  }
                >
                  {formatDate(new Date(record.date))}
                </TableCell>
                <TableCell
                  className={`font-bold cursor-pointer underline ${
                    record.type === TransactionType.Income
                      ? 'text-green-600 dark:text-green-400'
                      : record.type === TransactionType.Expense
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                  onClick={() =>
                    editFilter({
                      currentFilter: filterCriteria,
                      callBack: handleFilterChange,
                      target: 'type',
                      comparator: 'AND',
                      value: record.type,
                    })
                  }
                >
                  {record.type}
                </TableCell>
                <TableCell
                  className={`font-bold ${
                    record.type === TransactionType.Income
                      ? 'text-green-600 dark:text-green-400'
                      : record.type === TransactionType.Expense
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {formatCurrency(record.amount, CURRENCY.FX)}
                </TableCell>
                {record.fromWallet?.name || record.fromWallet?.type ? (
                  <TableCell
                    className={`${
                      record.type === TransactionType.Income
                        ? 'text-green-600 dark:text-green-400'
                        : record.type === TransactionType.Expense
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {record.fromWallet?.name === SavingWalletType.SAVING ||
                    record.fromWallet?.type === SavingWalletType.SAVING
                      ? `Smart ${record.fromWallet?.name || record.fromWallet?.type}`
                      : record.fromWallet?.name || record.fromWallet?.type}{' '}
                    Wallet
                  </TableCell>
                ) : (
                  <TableCell className="text-green-600 dark:text-green-400">
                    Smart Saving Bonus
                  </TableCell>
                )}
                {record.toWallet?.name || record.toWallet?.type ? (
                  <TableCell
                    className={`${
                      record.type === TransactionType.Income
                        ? 'text-green-600 dark:text-green-400'
                        : record.type === TransactionType.Expense
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {record.toWallet?.name === SavingWalletType.SAVING ||
                    record.toWallet?.type === SavingWalletType.SAVING
                      ? `Smart ${record.toWallet?.name || record.toWallet?.type}`
                      : record.toWallet?.name || record.toWallet?.type}{' '}
                    Wallet
                  </TableCell>
                ) : (
                  <TableCell className="italic text-gray-500">Unknown</TableCell>
                )}
                {record.remark ? (
                  <TableCell
                    className={`${
                      record.type === TransactionType.Income
                        ? 'text-green-600 dark:text-green-400'
                        : record.type === TransactionType.Expense
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {record.remark}
                  </TableCell>
                ) : (
                  <TableCell className="italic text-gray-500">Unknown</TableCell>
                )}
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => gotoDetailPage(record.id)}
                        >
                          <FileText size={18} color="#595959" />
                        </Button>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            );
          })}
          {displayData.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={Object.entries(tableVisibleColumns).length}>
                <div className="w-full h-full flex justify-center items-center">
                  <Label className="italic">No data available</Label>
                </div>
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow>
              <TableCell colSpan={Object.entries(tableVisibleColumns).length}>
                <div className="w-full min-h-5 h-full flex items-center justify-center">
                  <Label>Loading more data...</Label>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default SavingTableHistory;
