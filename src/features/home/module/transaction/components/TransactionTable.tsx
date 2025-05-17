'use client';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { FilterCriteria, OrderType } from '@/shared/types';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { debounce } from 'lodash';
import { FileText, Loader2, Search, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import { formatCurrency } from '../hooks/formatCurrency';
import { formatDate } from '../hooks/formatDate';
import { updateAmountRange, updateFilterCriteria } from '../slices';
import {
  IRelationalTransaction,
  ITransactionPaginatedResponse,
  TransactionColumn,
  TransactionTableColumnKey,
} from '../types';
import {
  DEFAULT_TRANSACTION_TABLE_COLUMNS,
  TRANSACTION_TYPE,
  TransactionCurrency,
  TransactionTableToEntity,
} from '../utils/constants';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import FilterMenu from './FilterMenu';
import SettingsMenu from './SettingMenu';
import { editFilter } from '@/components/common/filters';

type PaginationParams = {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  totalItems: number;
};

const initPaginationParams: PaginationParams = {
  currentPage: 1,
  pageSize: 20,
  totalPage: 0,
  totalItems: 0,
};

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

const TransactionTable = () => {
  const { data } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mutate } = useSWRConfig();
  const toggleRef = useRef(null);
  const { visibleColumns, filterCriteria } = useAppSelector((state) => state.transaction);

  //Sort states
  const [displayData, setDisplayData] = useState<IRelationalTransaction[]>([]);
  const [sortOrder, setSortOrder] = useState<OrderType | undefined>('desc');
  const [sortTarget, setSortTarget] = useState<string>('date');
  const [hoveringIdx, setHoveringIdx] = useState<number>(-1);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>(initPaginationParams);
  const [currentDate] = useState<Date>(new Date());

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    IRelationalTransaction | undefined
  >();

  const {
    data: fetchData,
    isLoading,
    isValidating,
  } = useDataFetcher<ITransactionPaginatedResponse>({
    endpoint: '/api/transactions',
    method: 'POST',
    body: {
      ...filterCriteria,
      page: paginationParams.currentPage,
      pageSize: paginationParams.pageSize,
      sortBy: { [sortTarget]: sortOrder },
      userId: data?.user.id,
    },
  });

  // Implement intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoading &&
          paginationParams.currentPage < paginationParams.totalPage
        ) {
          if (
            paginationParams.currentPage < paginationParams.totalPage &&
            !isLoading &&
            !isValidating
          ) {
            setPaginationParams((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
          }
        }
      },
      { threshold: 0.2 },
    );

    const currentToggleRef = toggleRef.current;
    if (currentToggleRef && displayData.length >= 20) {
      observer.observe(currentToggleRef);
    }

    return () => {
      if (currentToggleRef) {
        observer.unobserve(currentToggleRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, paginationParams.currentPage, paginationParams.totalPage, fetchData]);

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        console.log('value', value);
        handleFilterChange({ ...filterCriteria, search: String(value).trim() });
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterCriteria],
  );

  // Handle data fetched from API
  useEffect(() => {
    if (fetchData?.status === 201 && fetchData?.data.data) {
      setPaginationParams((prev) => ({
        ...prev,
        totalPage: fetchData?.data.totalPage,
        totalItems: fetchData?.data.total,
      }));
      dispatch(
        updateAmountRange({ min: fetchData?.data.amountMin, max: fetchData?.data.amountMax }),
      );

      if (paginationParams.currentPage === 1) {
        setDisplayData(
          fetchData?.data.data.map((item) => ({
            ...item,
            createdBy: item.createdBy || '', // Ensure createdBy is never null
          })) as IRelationalTransaction[],
        );
      } else {
        setDisplayData((prev) => [
          ...prev,
          ...((fetchData?.data.data.map((item) => ({
            ...item,
            createdBy: item.createdBy || '', // Ensure createdBy is never null
          })) as IRelationalTransaction[]) || []),
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  // Mutate data when filter criteria and pageNumber changes for lazy loading and filter feature
  useEffect(() => {
    if (fetchData) {
      mutate('/api/transactions', displayData, {
        revalidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.currentPage, filterCriteria]);

  // Handle sort logics for column header
  const handleSort = (header: string) => {
    if (sortTarget === header) {
      // Nếu đẫ có sort tồn tại
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortOrder(undefined);
        setSortTarget('');
      }
    } else {
      setSortTarget(header);
      setSortOrder('asc');
    }
    handleFilterChange({ ...filterCriteria, sortBy: sortOrder ? { [sortTarget]: sortOrder } : {} });
  };

  // Navigate to create native page
  const handleCreateTransaction = () => {
    router.push('/transaction/create');
  };

  const handleDeleteTransaction = () => {
    //delete logics here
    const endpoint = `/api/transactions/transaction?id=${selectedTransaction?.id}`;
    setIsDeleting(true);
    fetch(endpoint, {
      method: 'DELETE',
    })
      .then(async (response) => {
        const responseData = await response.json();

        if (response.ok) {
          // Remove the deleted transaction from the display data
          setDisplayData((prev) => prev.filter((item) => item.id !== selectedTransaction?.id));

          // Close the delete modal
          setIsDeleteModalOpen(false);
          setSelectedTransaction(undefined);

          // Alert the user of successful deletion
          toast.success('Transaction deleted successfully');

          // Revalidate data
          mutate('/api/transactions');
        } else {
          throw new Error(responseData.message || 'Failed to delete transaction');
        }
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to delete transaction');
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  // Navigate to delete page
  const handleCloseDeleteModal = () => {
    //delete logics here
    setIsDeleteModalOpen(false);
    setSelectedTransaction(undefined);
  };

  const handleOpenDeleteModal = (transaction: IRelationalTransaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  // Callback function to apply after updating filter criteria
  const handleFilterChange = (newFilter: FilterCriteria) => {
    setPaginationParams((prev) => ({ ...prev, currentPage: 1 })); // Reset current page to 1 when applying a new filter
    dispatch(updateFilterCriteria(newFilter));
  };

  // Function to check if a date is older than 3 months
  const isDeleteForbidden = (date: string | Date): boolean => {
    const transactionDate = new Date(date);

    // Calculate date 3 months ago from current date
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    // Return true if transaction date is before the 3-months-ago date
    return transactionDate < threeMonthsAgo;
  };

  // Memoize the visible columns to avoid re-rendering
  const tableVisibleColumns: TransactionTableColumnKey = useMemo((): TransactionTableColumnKey => {
    const columns =
      Object.keys(visibleColumns).length > 0
        ? Object.keys(visibleColumns)?.reduce((acc, key) => {
            if (visibleColumns[key as TransactionColumn].index > 0) {
              acc[key as TransactionColumn] = visibleColumns[key as TransactionColumn];
            }
            return acc;
          }, {} as TransactionTableColumnKey)
        : DEFAULT_TRANSACTION_TABLE_COLUMNS;

    // Sort columns by index
    return Object.fromEntries(
      Object.entries(columns)
        .sort((a, b) => a[1].index - b[1].index)
        .map(([key, value]) => [key, value]),
    ) as TransactionTableColumnKey;
  }, [visibleColumns]);

  return (
    <>
      <Table className="border-[1px] border-gray-300">
        <TableHeader>
          <TableRow className="hover:bg-none">
            <TableCell colSpan={8}>
              <div className="w-full flex justify-between py-2 px-5">
                {/* Search Box container*/}
                <div className="flex flex-col justify-start items-start gap-4">
                  <div className="flex gap-2">
                    <div className="relative w-[30vw]">
                      <Input
                        title="Search"
                        placeholder="Search"
                        className="w-full"
                        onChange={(e) => debouncedFilterHandler(e.target.value)}
                        onBlur={() => debouncedFilterHandler.flush()}
                      />
                      <Search
                        size={15}
                        className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50"
                      />
                    </div>
                    <FilterMenu callBack={handleFilterChange} />
                  </div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    Displaying{' '}
                    <strong>
                      {displayData.length}/{paginationParams.totalItems}
                    </strong>{' '}
                    transaction records
                  </Label>
                </div>
                {/* function button group*/}
                <div className="flex gap-2">
                  {/* Create button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleCreateTransaction}
                          className="px-3 py-2 bg-green-200 hover:bg-green-500 border-green-600"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                              fill="#000000"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create Transaction</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Setting button */}
                  <SettingsMenu />
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className="font-bold text-center">
            {Object.entries(tableVisibleColumns).map(([key, value], idx) => {
              const entityKey =
                TransactionTableToEntity[key as keyof typeof TransactionTableToEntity];
              return (
                <TableCell
                  className={`cursor-${value.sortable && !isLoading && !isValidating ? 'pointer' : 'default'}`}
                  key={idx}
                  onMouseEnter={() => setHoveringIdx(idx)}
                  onMouseLeave={() => setHoveringIdx(-1)}
                  onClick={() => {
                    if (!isLoading && !isValidating) handleSort(entityKey);
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
                        {!isLoading && !isValidating ? (
                          <SortArrowBtn
                            sortOrder={sortOrder ?? 'none'}
                            isActivated={sortTarget === entityKey}
                          />
                        ) : (
                          <Loader2 color={'blue'} className="h-4 w-4 text-primary animate-spin" />
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
          {/* Table data loop */}
          {displayData.map((transRecord: IRelationalTransaction, index: number) => {
            const recordDate = new Date(transRecord.date.toString());

            return (
              <TableRow
                key={index}
                className={`text-center text-${TRANSACTION_TYPE[transRecord.type.toUpperCase()]}`}
              >
                {Object.entries(tableVisibleColumns)
                  .sort(([, a], [, b]) => a.index - b.index)
                  .filter(([, col]) => col.index > 0)
                  .map(([columnKey]) => {
                    switch (columnKey) {
                      case 'No.':
                        return <TableCell key={columnKey}>{index + 1}</TableCell>;
                      case 'Date':
                        return (
                          <TableCell
                            key={columnKey}
                            className="underline cursor-pointer"
                            onClick={() =>
                              editFilter({
                                currentFilter: filterCriteria,
                                callBack: handleFilterChange,
                                target: 'date',
                                comparator: 'AND',
                                value: transRecord.date.toString(),
                              })
                            }
                          >
                            {formatDate(recordDate)}
                          </TableCell>
                        );
                      case 'Type':
                        return (
                          <TableCell
                            key={columnKey}
                            className={`underline cursor-pointer font-bold`}
                            onClick={() =>
                              editFilter({
                                currentFilter: filterCriteria,
                                callBack: handleFilterChange,
                                target: 'type',
                                comparator: 'AND',
                                value: transRecord.type,
                              })
                            }
                          >
                            {transRecord.type}
                          </TableCell>
                        );
                      case 'Amount':
                        return (
                          <TableCell key={columnKey} className={`font-bold`}>
                            {formatCurrency(
                              Number(transRecord.amount),
                              transRecord.currency as TransactionCurrency,
                            )}{' '}
                          </TableCell>
                        );
                      case 'From':
                        return (
                          <TableCell
                            key={columnKey}
                            className={cn(
                              'cursor-default',
                              transRecord.fromAccountId || transRecord.fromCategoryId
                                ? 'underline cursor-pointer'
                                : 'text-gray-500',
                            )}
                            onClick={() =>
                              editFilter({
                                currentFilter: filterCriteria,
                                callBack: handleFilterChange,
                                target:
                                  transRecord.type === 'Income' ? 'fromCategory' : 'fromAccount',
                                subTarget: 'name',
                                comparator: 'AND',
                                value:
                                  transRecord.type === 'Income'
                                    ? (transRecord.fromCategory?.name ?? '')
                                    : (transRecord.fromAccount?.name ?? ''),
                              })
                            }
                          >
                            {transRecord.fromAccount?.name ??
                              transRecord.fromCategory?.name ??
                              'Unknown'}
                          </TableCell>
                        );
                      case 'To':
                        return (
                          <TableCell
                            key={columnKey}
                            className={cn(
                              'cursor-default',
                              transRecord.toAccountId || transRecord.toCategoryId
                                ? 'underline cursor-pointer'
                                : 'text-gray-500',
                            )}
                            onClick={() =>
                              editFilter({
                                currentFilter: filterCriteria,
                                callBack: handleFilterChange,
                                target: transRecord.type === 'Expense' ? 'toCategory' : 'toAccount',
                                subTarget: 'name',
                                comparator: 'AND',
                                value:
                                  transRecord.type === 'Expense'
                                    ? (transRecord.toCategory?.name ?? '')
                                    : (transRecord.toAccount?.name ?? ''),
                              })
                            }
                          >
                            {transRecord.toAccount?.name ??
                              transRecord.toCategory?.name ??
                              'Unknown'}
                          </TableCell>
                        );
                      case 'Partner':
                        return (
                          <TableCell
                            key={columnKey}
                            className={cn(
                              'cursor-default',
                              transRecord.partnerId ? 'underline cursor-pointer' : 'text-gray-500',
                            )}
                            onClick={() =>
                              editFilter({
                                currentFilter: filterCriteria,
                                callBack: handleFilterChange,
                                target: 'partner',
                                subTarget: 'name',
                                comparator: 'AND',
                                value: transRecord.partner?.name ?? '',
                              })
                            }
                          >
                            {transRecord.partner?.name ?? 'Unknown'}
                          </TableCell>
                        );
                      case 'Actions':
                        return (
                          <TableCell key={columnKey} className="flex justify-center gap-2">
                            {/* Detail button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="px-3 py-2 hover:bg-gray-200 "
                                    onClick={() =>
                                      router.push(`/transaction/details/${transRecord.id}`)
                                    }
                                  >
                                    <FileText size={18} color="#595959" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Delete button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className={`px-3 py-2 ${isDeleteForbidden(recordDate) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-200'}`}
                                    onClick={() => {
                                      if (!isDeleteForbidden(recordDate)) {
                                        handleOpenDeleteModal(transRecord);
                                      }
                                    }}
                                    disabled={isDeleteForbidden(recordDate)}
                                  >
                                    <Trash
                                      size={18}
                                      color={isDeleteForbidden(recordDate) ? 'gray' : 'red'}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {isDeleteForbidden(recordDate)
                                      ? "Can't delete transactions older than 3 months"
                                      : 'Delete Transaction'}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        );
                      default:
                        return <TableCell key={columnKey}>-</TableCell>;
                    }
                  })}
              </TableRow>
            );
          })}
          {displayData.length === 0 && !isLoading && !isValidating && (
            <TableRow>
              <TableCell colSpan={Object.entries(tableVisibleColumns).length}>
                <div className="w-full h-full flex justify-center items-center">
                  <Label className="italic">No data available</Label>
                </div>
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell colSpan={Object.entries(tableVisibleColumns).length}>
              <div
                className="target-div w-full h-full min-h-5 flex justify-center items-center"
                ref={toggleRef}
              >
                {(isLoading || isValidating) && <Label>Loading more data...</Label>}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DeleteTransactionDialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteTransaction}
        data={selectedTransaction}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default TransactionTable;
