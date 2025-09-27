'use client';

import { Loading } from '@/components/common/atoms';
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
import { useEffect, useMemo, useState } from 'react';
import { useWindowScrollToBottom } from '../../hooks/useWindowScroll';
import { resetSavingWallet, updateFilterCriteria, updatePage } from '../../slices';
import { fetchSavingTransactions } from '../../slices/actions';
import { ISavingHistory, SavingColumn, SavingTableColumnKey } from '../../types';
import { DEFAULT_SAVING_TRANSACTION_TABLE_COLUMNS } from '../../utils/constants';
import { SavingTransactionTableToEntity, SavingWalletType } from '../../utils/enums';
import { formatDate } from '../../utils/formatDate';
import SavingFilterMenu from '../atoms/SavingFilterMenu';
import SavingSearch from '../atoms/SavingSearch';
import { SavingHistoryDetailPage } from '../pages';

const SortArrowBtn = ({
  sortOrder,
  isActivated,
}: {
  sortOrder: OrderType;
  isActivated: boolean;
}) => (
  <div
    className={` h-fit transition-transform duration-300 overflow-visible ${
      isActivated && !(sortOrder === 'asc' || sortOrder === 'none') ? 'rotate-0' : 'rotate-180'
    }`}
  >
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 2C7.77614 2 8 2.22386 8 2.5L8 11.2929L11.1464 8.14645C11.3417 7.95118 11.6583 7.95118 11.8536 8.14645C12.0488 8.34171 12.0488 8.65829 11.8536 8.85355L7.85355 12.8536C7.75979 12.9473 7.63261 13 7.5 13C7.36739 13 7.24021 12.9473 7.14645 12.8536L3.14645 8.85355C2.95118 8.65829 2.95118 8.34171 3.14645 8.14645C3.34171 7.95118 3.65829 7.95118 3.85355 8.14645L7 11.2929L7 2.5C7 2.22386 7.22386 2 7.5 2Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

function SavingTableHistory() {
  const { formatCurrency } = useCurrencyFormatter();
  const dispatch = useAppDispatch();
  const [showHistoryDetail, setShowHistoryDetail] = useState<ISavingHistory | null>(null);
  const {
    visibleColumns,
    filterCriteria,
    history,
    loading,
    error,
    page,
    pageSize,
    refetchTrigger,
  } = useAppSelector((state) => state.savingWallet);
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
    if (history && history.data && history.data.data.length) {
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

  useEffect(() => {
    return () => {
      dispatch(resetSavingWallet());
      setDisplayData([]);
    };
  }, []);

  if (loading && !history && displayData.length === 0) {
    return <Loading />;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`mt-4 overflow-y-scroll scroll-smooth relative`}>
      <div className="h-20 flex items-center justify-between p-4 border border-b-0">
        <div className="flex items-center gap-2">
          <SavingSearch callback={debouncedFilterHandler} />
          <SavingFilterMenu callBack={handleFilterChange} />
        </div>
        <Label className="text-gray-600 dark:text-gray-400">
          Total <strong>{history?.data.total}</strong> records
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
                          <SortArrowBtn
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
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatDate(new Date(record.date))}</TableCell>
                <TableCell
                  className={`font-bold ${
                    record.type.toLowerCase() === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : record.type.toLowerCase() === 'expense'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-black dark:text-white'
                  }`}
                >
                  {record.type}
                </TableCell>
                <TableCell
                  className={`font-bold ${
                    record.type.toLowerCase() === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : record.type.toLowerCase() === 'expense'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-black dark:text-white'
                  }`}
                >
                  {formatCurrency(record.amount, CURRENCY.FX)}
                </TableCell>
                {record.fromWallet?.name || record.fromWallet?.type ? (
                  <TableCell>
                    {record.fromWallet?.name === SavingWalletType.SAVING ||
                    record.fromWallet?.type === SavingWalletType.SAVING
                      ? `Smart ${record.fromWallet?.name || record.fromWallet?.type}`
                      : record.fromWallet?.name || record.fromWallet?.type}{' '}
                    Wallet
                  </TableCell>
                ) : (
                  <TableCell>Smart Saving Bonus</TableCell>
                )}
                {record.toWallet?.name || record.toWallet?.type ? (
                  <TableCell>
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
                  <TableCell>{record.remark}</TableCell>
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
                          onClick={() => setShowHistoryDetail(record)}
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

      {!!showHistoryDetail && (
        <SavingHistoryDetailPage
          field={showHistoryDetail}
          handleClose={() => setShowHistoryDetail(null)}
        />
      )}
    </div>
  );
}

export default SavingTableHistory;
