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
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateSavingHistoryRequest } from '../../data/tdo/request/CreateSavingHistoryRequest';
import useFetchDataTransactionHistory from '../../hooks/useFetchDataTransactionHistory';
import { useWindowScrollToBottom, useWindowScrollToTop } from '../../hooks/useWindowScroll';
import { ISavingHistory, SavingColumn } from '../../types';
import { SAVING_COLUMNS } from '../../utils/constants';
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
  const [request, setRequest] = useState<CreateSavingHistoryRequest>({
    filters: {},
    page: 1,
    pageSize: 20,
    sortBy: {
      date: 'desc',
    },
    searchParams: '',
    userId: '',
  });
  const { data, loading, error } = useFetchDataTransactionHistory(request);
  const [windowScrollToBottom, setWindowScrollToBottom] = useState<boolean>(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState<ISavingHistory | null>(null);

  const checkColIntoSorted = (col: SavingColumn) => {
    const lowerCol = col.toLowerCase();
    return request.sortBy?.[lowerCol] ? true : false;
  };

  const handleSort = (col: SavingColumn) => {
    const lowerCol = col.toLowerCase();
    const currentOrder = request.sortBy?.[lowerCol];

    if (currentOrder) {
      setRequest({
        ...request,
        sortBy: {
          [lowerCol]: currentOrder === 'desc' ? 'asc' : 'desc',
        },
      });
    } else {
      setRequest({
        ...request,
        sortBy: {
          [lowerCol]: 'desc',
        },
      });
    }
  };

  // UX Table Scroll
  useWindowScrollToBottom(() => {
    if (!windowScrollToBottom) {
      setWindowScrollToBottom(true);
    }
  });

  useWindowScrollToTop(() => {
    if (windowScrollToBottom) {
      setWindowScrollToBottom(false);
    }
  }, document.body.offsetHeight);
  // UX Table Scroll end

  const handleFilterChange = (newFilter: FilterCriteria) => {};

  useEffect(() => {
    return () => {
      setWindowScrollToBottom(false);
    };
  }, []);

  if (!data) return <p>No data</p>;
  if (loading && !data) {
    return <Loading />;
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div
      className={`max-h-screen mt-4 overflow-y-${windowScrollToBottom ? 'scroll' : 'hidden'} scroll-smooth md:scroll-auto relative`}
    >
      <div className="h-20 flex items-center justify-between p-4 border border-b-0">
        <div className="flex items-center gap-2">
          <SavingSearch />
          <SavingFilterMenu callBack={handleFilterChange} />
        </div>
        <Label className="text-gray-600 dark:text-gray-400">
          Total <strong>{data.data.total}</strong> records
        </Label>
      </div>
      <Table className="border-[1px]">
        <TableHeader>
          <TableRow className="font-bold text-center">
            {SAVING_COLUMNS.length > 0 &&
              SAVING_COLUMNS.map((item, index) => (
                <TableCell
                  key={index}
                  className={`cursor-${item.sortable ? 'pointer' : 'default'}`}
                  onClick={() => item.sortable && handleSort(item.col as SavingColumn)}
                >
                  <div
                    className={`flex items-center justify-center ${item.sortable && checkColIntoSorted(item.col) && 'text-blue-600 dark:text-blue-400'}`}
                  >
                    <span>{item.col}</span>
                    {request?.sortBy && item.sortable && checkColIntoSorted(item.col) && (
                      <SortArrowBtn
                        sortOrder={request.sortBy[item.col.toLowerCase()] ?? 'none'}
                        isActivated={item.sortable}
                      />
                    )}
                  </div>
                </TableCell>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.data.map((record: ISavingHistory, index: number) => {
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
                  <TableCell>{record.fromWallet?.name || record.fromWallet?.type}</TableCell>
                ) : (
                  <TableCell className="italic text-gray-500">Unknown</TableCell>
                )}
                {record.toWallet?.name || record.toWallet?.type ? (
                  <TableCell>{record.toWallet?.name || record.toWallet?.type}</TableCell>
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
