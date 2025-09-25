'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { OrderType } from '@/shared/types';
import { FilterCriteria } from '@/shared/types/filter.types';
import { FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useWindowScrollToBottom, useWindowScrollToTop } from '../../hooks/useWindowScroll';
import { ISavingHistory, SavingColumn, SavingTableColumnKey } from '../../types';
import { formatDate } from '../../utils/formatDate';
import SavingFilterMenu from '../atoms/SavingFilterMenu';
import SavingSearch from '../atoms/SavingSearch';
import { SavingHistoryDetailPage } from '../pages';

const DUMMY_DATA: ISavingHistory[] = [
  {
    id: 1,
    date: new Date(2025, 1, 12),
    type: 'Income',
    amount: 200.5,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 2,
    date: new Date(2025, 1, 13),
    type: 'Transfer',
    amount: 1500.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 3,
    date: new Date(2025, 1, 14),
    type: 'Expense',
    amount: 300.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 4,
    date: new Date(2025, 1, 15),
    type: 'Transfer',
    amount: 50.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 5,
    date: new Date(2025, 1, 16),
    type: 'Income',
    amount: 75.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 6,
    date: new Date(2025, 1, 17),
    type: 'Transfer',
    amount: 250.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 7,
    date: new Date(2025, 1, 18),
    type: 'Income',
    amount: 600.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 8,
    date: new Date(2025, 1, 19),
    type: 'Expense',
    amount: 100.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 9,
    date: new Date(2025, 1, 20),
    type: 'Transfer',
    amount: 1200.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 10,
    date: new Date(2025, 1, 21),
    type: 'Income',
    amount: 90.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 11,
    date: new Date(2025, 1, 22),
    type: 'Expense',
    amount: 400.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 12,
    date: new Date(2025, 1, 23),
    type: 'Transfer',
    amount: 800.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 13,
    date: new Date(2025, 1, 24),
    type: 'Income',
    amount: 30.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 14,
    date: new Date(2025, 1, 25),
    type: 'Expense',
    amount: 250.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 15,
    date: new Date(2025, 1, 26),
    type: 'Transfer',
    amount: 90.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 16,
    date: new Date(2025, 1, 27),
    type: 'Income',
    amount: 45.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 17,
    date: new Date(2025, 1, 28),
    type: 'Transfer',
    amount: 300.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 18,
    date: new Date(2025, 2, 1),
    type: 'Expense',
    amount: 200.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 19,
    date: new Date(2025, 2, 2),
    type: 'Income',
    amount: 500.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 20,
    date: new Date(2025, 2, 3),
    type: 'Transfer',
    amount: 100.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 21,
    date: new Date(2025, 2, 4),
    type: 'Expense',
    amount: 320.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 22,
    date: new Date(2025, 2, 5),
    type: 'Income',
    amount: 110.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 23,
    date: new Date(2025, 2, 6),
    type: 'Transfer',
    amount: 700.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 24,
    date: new Date(2025, 2, 7),
    type: 'Income',
    amount: 60.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 25,
    date: new Date(2025, 2, 8),
    type: 'Transfer',
    amount: 400.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 26,
    date: new Date(2025, 2, 9),
    type: 'Expense',
    amount: 150.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 27,
    date: new Date(2025, 2, 10),
    type: 'Income',
    amount: 250.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 28,
    date: new Date(2025, 2, 11),
    type: 'Transfer',
    amount: 900.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 29,
    date: new Date(2025, 2, 12),
    type: 'Expense',
    amount: 330.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 30,
    date: new Date(2025, 2, 13),
    type: 'Income',
    amount: 80.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 31,
    date: new Date(2025, 2, 14),
    type: 'Transfer',
    amount: 450.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 32,
    date: new Date(2025, 2, 15),
    type: 'Expense',
    amount: 220.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 33,
    date: new Date(2025, 2, 16),
    type: 'Income',
    amount: 120.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 34,
    date: new Date(2025, 2, 17),
    type: 'Transfer',
    amount: 620.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 35,
    date: new Date(2025, 2, 18),
    type: 'Income',
    amount: 55.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 36,
    date: new Date(2025, 2, 19),
    type: 'Expense',
    amount: 310.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 37,
    date: new Date(2025, 2, 20),
    type: 'Transfer',
    amount: 1000.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 38,
    date: new Date(2025, 2, 21),
    type: 'Income',
    amount: 95.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 39,
    date: new Date(2025, 2, 22),
    type: 'Transfer',
    amount: 800.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 40,
    date: new Date(2025, 2, 23),
    type: 'Expense',
    amount: 280.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 41,
    date: new Date(2025, 2, 24),
    type: 'Income',
    amount: 40.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 42,
    date: new Date(2025, 2, 25),
    type: 'Transfer',
    amount: 350.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 43,
    date: new Date(2025, 2, 26),
    type: 'Income',
    amount: 140.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 44,
    date: new Date(2025, 2, 27),
    type: 'Expense',
    amount: 260.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 45,
    date: new Date(2025, 2, 28),
    type: 'Transfer',
    amount: 720.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
  {
    id: 46,
    date: new Date(2025, 3, 1),
    type: 'Income',
    amount: 65.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 47,
    date: new Date(2025, 3, 2),
    type: 'Transfer',
    amount: 550.0,
    from: 'Smart Saving Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Claims Reward on Principal',
  },
  {
    id: 48,
    date: new Date(2025, 3, 3),
    type: 'Expense',
    amount: 230.0,
    from: 'Payment Wallet',
    to: 'Smart Saving Wallet',
    remark: 'Deposit',
  },
  {
    id: 49,
    date: new Date(2025, 3, 4),
    type: 'Income',
    amount: 85.0,
    from: 'Smart Saving Bonus',
    to: 'Smart Saving Wallet',
    remark: 'Smart Saving Reward',
  },
  {
    id: 50,
    date: new Date(2025, 3, 5),
    type: 'Transfer',
    amount: 670.0,
    from: 'Smart Saving Wallet',
    to: 'Payment Wallet',
    remark: 'Claims Reward',
  },
];

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
  const [displayData, setDisplayData] = useState<ISavingHistory[]>([]);
  const [tableVisibleColumns, setTableVisibleColumns] = useState<SavingTableColumnKey>({
    'No.': { col: 'No.', sortable: false },
    Date: { col: 'Date', sortable: true, sortedBy: 'desc' },
    Type: { col: 'Type', sortable: true, sortedBy: 'none' },
    Amount: { col: 'Amount', sortable: true, sortedBy: 'none' },
    From: { col: 'From', sortable: true, sortedBy: 'none' },
    To: { col: 'To', sortable: true, sortedBy: 'none' },
    Remark: { col: 'Remark', sortable: true, sortedBy: 'none' },
    Actions: { col: 'Actions', sortable: false },
  });
  const [windowScrollToBottom, setWindowScrollToBottom] = useState<boolean>(false);
  const [showHistoryDetail, setShowHistoryDetail] = useState<ISavingHistory | null>(null);

  const columnToField: Record<SavingColumn, keyof ISavingHistory | null> = useMemo(() => {
    return {
      'No.': null,
      Date: 'date',
      Type: 'type',
      Amount: 'amount',
      From: 'from',
      To: 'to',
      Remark: 'remark',
      Actions: null,
    };
  }, []);

  useEffect(() => {
    if (DUMMY_DATA && DUMMY_DATA.length > 0) {
      const sortedData = [...DUMMY_DATA].sort((a, b) => b.date.getTime() - a.date.getTime());
      setDisplayData(sortedData);
    }
  }, [DUMMY_DATA]);

  const handleSort = (col: SavingColumn) => {
    const filed = columnToField[col];
    if (!filed) return;

    const updateColSortState = (newOrderSort: OrderType) => {
      setTableVisibleColumns((prevCols) => {
        const updatedCols: SavingTableColumnKey = { ...prevCols };

        Object.keys(updatedCols).forEach((key) => {
          if (updatedCols[key as SavingColumn].sortable) {
            updatedCols[key as SavingColumn] = {
              ...updatedCols[key as SavingColumn],
              sortedBy: key === col ? newOrderSort : 'none',
            };
          }
        });

        return updatedCols;
      });
    };

    setDisplayData((prev: ISavingHistory[]) => {
      const currentOrderSort = tableVisibleColumns[col]?.sortedBy || 'none';

      let newOrderSort: OrderType = 'desc';
      if (currentOrderSort === 'desc') newOrderSort = 'asc';

      const sortedDate: ISavingHistory[] = [...prev].sort((a, b) => {
        const firstValue = a[filed];
        const secondValue = b[filed];

        if (firstValue instanceof Date && secondValue instanceof Date) {
          return newOrderSort === 'asc'
            ? (firstValue as Date).getTime() - (secondValue as Date).getTime()
            : (secondValue as Date).getTime() - (firstValue as Date).getTime();
        }

        if (typeof firstValue === 'number' && typeof secondValue === 'number') {
          return newOrderSort === 'asc' ? firstValue - secondValue : secondValue - firstValue;
        }

        if (typeof firstValue === 'string' && typeof secondValue === 'string') {
          return newOrderSort === 'asc'
            ? firstValue.localeCompare(secondValue)
            : secondValue.localeCompare(firstValue);
        }

        return 0;
      });

      // Update column sort state
      updateColSortState(newOrderSort);

      return sortedDate;
    });
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
          Total <strong>{displayData.length}</strong> records
        </Label>
      </div>
      <Table className="border-[1px]">
        <TableHeader>
          <TableRow className="font-bold text-center">
            {Object.entries(tableVisibleColumns).length > 0 &&
              Object.entries(tableVisibleColumns).map(([key, value]) => (
                <TableCell
                  key={key}
                  className={`cursor-${value.sortable ? 'pointer' : 'default'}`}
                  onClick={() => value.sortable && handleSort(key as SavingColumn)}
                >
                  <div
                    className={`flex items-center justify-center ${value.sortable && value?.sortedBy !== 'none' && 'text-blue-600 dark:text-blue-400'}`}
                  >
                    <span>{value.col}</span>
                    {value.sortable && value?.sortedBy !== 'none' && (
                      <SortArrowBtn
                        sortOrder={value.sortedBy ?? 'none'}
                        isActivated={value.sortable}
                      />
                    )}
                  </div>
                </TableCell>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayData.map((record: ISavingHistory, index: number) => {
            return (
              <TableRow key={record.id} className="text-center">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
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
                <TableCell>{record.from}</TableCell>
                <TableCell>{record.to}</TableCell>
                <TableCell>{record.remark}</TableCell>
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
