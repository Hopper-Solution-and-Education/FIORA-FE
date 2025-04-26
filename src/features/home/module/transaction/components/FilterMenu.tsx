import DateRangePicker from '@/components/common/forms/date-range-picker/DateRangePicker';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { Check, FunnelPlus, FunnelX, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { formatCurrency } from '../hooks/formatCurrency';
import { TransactionFilterCriteria, TransactionFilterOptionResponse } from '../types';
import { DEFAULT_TRANSACTION_FILTER_CRITERIA, TransactionCurrency } from '../utils/constants';
import { renderAmountSlider } from './renderSlider';

type FilterParams = {
  dateRange?: DateRange;
  types: string[];
  partners: string[];
  categories: string[];
  accounts: string[];
  amountMin: number;
  amountMax: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  partners: [],
  categories: [],
  accounts: [],
  amountMin: 0,
  amountMax: 10000,
};

type FilterMenuProps = {
  callBack: (newFilter: TransactionFilterCriteria) => void;
};

const FilterMenu = ({ callBack }: FilterMenuProps) => {
  const { amountMin, amountMax, filterCriteria } = useAppSelector((state) => state.transaction);

  const [isOpen, setIsOpen] = useState(false);
  const [isMinEditing, setIsMinEditing] = useState(false);
  const [isMaxEditing, setIsMaxEditing] = useState(false);

  const [filterParams, setFilterParams] = useState<FilterParams>({
    ...filterParamsInitState,
    amountMin: amountMin || 0,
    amountMax: amountMax || 10000,
  });

  // Fetch filter options only when dropdown is open
  const { data, isLoading, error } = useDataFetcher<TransactionFilterOptionResponse>({
    endpoint: isOpen ? '/api/transactions/options' : null,
    method: 'GET',
  });

  // Extract filter data from complex filter structure
  const extractFilterData = useCallback(
    (filters: any) => {
      const types: Set<string> = new Set();
      const partners: Set<string> = new Set();
      const categories: Set<string> = new Set();
      const accounts: Set<string> = new Set();
      let currentAmountMin = amountMin;
      let currentAmountMax = amountMax;
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;

      // Handle AND array structure
      if (Array.isArray(filters?.AND)) {
        filters.AND.forEach((condition: any) => {
          // Direct type conditions
          if (condition.type && typeof condition.type === 'string') {
            types.add(condition.type);
          }

          // Direct partner conditions
          if (condition.partner?.name) {
            partners.add(condition.partner.name);
          }

          // Direct account/category conditions
          if (condition.fromAccount?.name) categories.add(condition.fromAccount.name);
          if (condition.fromCategory?.name) categories.add(condition.fromCategory.name);
          if (condition.toAccount?.name) accounts.add(condition.toAccount.name);
          if (condition.toCategory?.name) accounts.add(condition.toCategory.name);

          // Direct amount conditions
          if (condition.amount) {
            if (condition.amount.gte !== undefined) currentAmountMin = condition.amount.gte;
            if (condition.amount.lte !== undefined) currentAmountMax = condition.amount.lte;
          }

          // Handle OR conditions
          if (condition.OR && Array.isArray(condition.OR)) {
            condition.OR.forEach((orItem: any) => {
              // Type OR conditions
              if (orItem.type) types.add(orItem.type);

              // Partner OR conditions
              if (orItem.partner?.name) partners.add(orItem.partner.name);

              // Handle nested OR structures for accounts/categories
              if (orItem.OR && Array.isArray(orItem.OR)) {
                orItem.OR.forEach((nestedItem: any) => {
                  if (nestedItem.fromAccount?.name) categories.add(nestedItem.fromAccount.name);
                  if (nestedItem.fromCategory?.name) categories.add(nestedItem.fromCategory.name);
                  if (nestedItem.toAccount?.name) accounts.add(nestedItem.toAccount.name);
                  if (nestedItem.toCategory?.name) accounts.add(nestedItem.toCategory.name);
                });
              }
            });
          }
        });
      } else {
        // Handle flat structure
        const flatFilters = filters || {};

        // Process simple fields
        if (flatFilters.type) types.add(flatFilters.type);
        if (flatFilters.partner?.name) partners.add(flatFilters.partner.name);
        if (flatFilters.fromAccount?.name) categories.add(flatFilters.fromAccount.name);
        if (flatFilters.fromCategory?.name) categories.add(flatFilters.fromCategory.name);
        if (flatFilters.toAccount?.name) accounts.add(flatFilters.toAccount.name);
        if (flatFilters.toCategory?.name) accounts.add(flatFilters.toCategory.name);

        // Process date range
        if (flatFilters.date) {
          dateFrom = flatFilters.date.gte ? new Date(flatFilters.date.gte) : undefined;
          dateTo = flatFilters.date.lte ? new Date(flatFilters.date.lte) : undefined;
        }

        // Process amount range
        if (flatFilters.amount) {
          currentAmountMin =
            flatFilters.amount.gte !== undefined ? flatFilters.amount.gte : amountMin;
          currentAmountMax =
            flatFilters.amount.lte !== undefined ? flatFilters.amount.lte : amountMax;
        }
      }

      return {
        types: Array.from(types),
        partners: Array.from(partners),
        categories: Array.from(categories),
        accounts: Array.from(accounts),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : undefined,
      };
    },
    [amountMin, amountMax],
  );

  // Update filter params when filter criteria changes
  useEffect(() => {
    if (filterCriteria && isOpen) {
      const extractedData = extractFilterData(filterCriteria.filters);
      setFilterParams(extractedData);
    }
  }, [filterCriteria, isOpen, extractFilterData]);

  const handleClose = () => {
    setIsOpen(false);
    setFilterParams({
      ...filterParamsInitState,
      amountMin: amountMin || 0,
      amountMax: amountMax || 10000,
    });
  };

  const handleResetFilter = () => {
    callBack(DEFAULT_TRANSACTION_FILTER_CRITERIA);
    handleClose();
  };

  const handleEditFilter = (target: keyof FilterParams, value: any) => {
    setFilterParams((prevParams) => ({
      ...prevParams,
      [target]: value,
    }));
  };

  // Creates the filter structure from the UI state
  const createFilterStructure = useCallback((params: FilterParams): Record<string, any> => {
    const updatedFilters: Record<string, any> = {};
    const andConditions: any[] = [];

    // Handle date range
    if (params.dateRange?.from || params.dateRange?.to) {
      updatedFilters.date = {
        gte: params.dateRange?.from ? params.dateRange.from.toISOString() : null,
        lte: params.dateRange?.to ? params.dateRange.to.toISOString() : null,
      };
    }

    // Types OR group
    if (params.types?.length) {
      andConditions.push({
        OR: params.types.map((type) => ({ type })),
      });
    }

    // Partners OR group
    if (params.partners?.length) {
      andConditions.push({
        OR: params.partners.map((partner) => ({
          partner: { name: partner },
        })),
      });
    }

    // Categories OR group
    if (params.categories?.length) {
      andConditions.push({
        OR: params.categories.map((from) => ({
          OR: [{ fromAccount: { name: from } }, { fromCategory: { name: from } }],
        })),
      });
    }

    // Accounts OR group
    if (params.accounts?.length) {
      andConditions.push({
        OR: params.accounts.map((to) => ({
          OR: [{ toAccount: { name: to } }, { toCategory: { name: to } }],
        })),
      });
    }

    // Amount as a separate condition
    andConditions.push({
      amount: {
        gte: params.amountMin,
        lte: params.amountMax,
      },
    });

    // Add AND conditions if there are any
    if (andConditions.length > 0) {
      updatedFilters.AND = andConditions;
    }

    return updatedFilters;
  }, []);

  const handleSaveFilterChanges = () => {
    const updatedFilters = createFilterStructure(filterParams);

    callBack({
      ...filterCriteria,
      filters: updatedFilters,
    });

    handleClose();
  };

  // Options for filter selects
  const typeOptions = useMemo(
    () => [
      { value: 'Expense', label: 'Expense' },
      { value: 'Income', label: 'Income' },
      { value: 'Transfer', label: 'Transfer' },
    ],
    [],
  );

  const partnerOptions = useMemo(() => {
    if (!data?.data?.partners) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.partners.map((option: string) => ({
      value: option,
      label: option,
    }));
  }, [data]);

  const accountOptions = useMemo(() => {
    if (!data?.data?.accounts) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.accounts.map((option: string) => ({
      value: option,
      label: option,
    }));
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (!data?.data?.categories) {
      return [{ label: 'No option available', value: 'none', disabled: true }];
    }

    return data.data.categories.map((option: string) => ({
      value: option,
      label: option,
    }));
  }, [data]);

  // Loading indicator component
  const LoadingIndicator = () => (
    <div className="w-fit h-fit absolute top-[50%] right-[15%] -translate-y-[25%] z-10">
      <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
    </div>
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={(open) => (open ? setIsOpen(open) : handleClose())}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 py-2" onClick={() => setIsOpen((prev) => !prev)}>
                <FunnelPlus size={15} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filters </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        className="w-fit min-w-200 rounded-lg p-4"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <h2 className="font-semibold">Filter & Settings</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Filter contents */}
        <div className="w-full h-fit max-h-[45vh] flex justify-start items-start p-2 pb-5">
          {/* Left column filters */}
          <DropdownMenuGroup className="w-[260px]">
            <div className="w-full h-full flex flex-col justify-start items-start gap-3">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Type</Label>
                <MultiSelect
                  options={typeOptions}
                  selected={filterParams.types}
                  onChange={(values: string[]) => handleEditFilter('types', values)}
                  placeholder="Select Types"
                  className="w-full px-4 py-2"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Category</Label>
                <div className="relative w-full h-fit">
                  {isLoading && <LoadingIndicator />}
                  <MultiSelect
                    options={accountOptions}
                    selected={filterParams.categories}
                    onChange={(values: string[]) => handleEditFilter('categories', values)}
                    placeholder="Select Categories"
                    className="w-full px-4 py-2"
                  />
                </div>
              </div>

              {/* Amount Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Amount</Label>
                <div className="w-full flex flex-row items-center justify-between gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          value={
                            !isMinEditing
                              ? formatCurrency(
                                  filterParams.amountMin,
                                  TransactionCurrency.VND,
                                  false,
                                )
                              : filterParams.amountMin
                          }
                          min={amountMin}
                          max={amountMax}
                          onFocus={(e) => {
                            setIsMinEditing(true);
                            e.target.select();
                          }}
                          onBlur={() => setIsMinEditing(false)}
                          placeholder="Min"
                          onChange={(e) =>
                            handleEditFilter(
                              'amountMin',
                              Number(e.target.value.split(',').join('')),
                            )
                          }
                          required
                          className={cn('w-[40%]')}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {formatCurrency(filterParams.amountMin, TransactionCurrency.VND, false)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Label>To</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          value={
                            !isMaxEditing
                              ? formatCurrency(
                                  filterParams.amountMax,
                                  TransactionCurrency.VND,
                                  false,
                                )
                              : filterParams.amountMax
                          }
                          min={amountMin}
                          max={amountMax}
                          placeholder="Max"
                          onFocus={(e) => {
                            setIsMaxEditing(true);
                            e.target.select();
                          }}
                          onBlur={() => setIsMaxEditing(false)}
                          onChange={(e) =>
                            handleEditFilter(
                              'amountMax',
                              Number(e.target.value.split(',').join('')),
                            )
                          }
                          required
                          className={cn('w-[60%]')}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {formatCurrency(filterParams.amountMax, TransactionCurrency.VND, false)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {renderAmountSlider({
                  amountMin: filterParams.amountMin,
                  amountMax: filterParams.amountMax,
                  minRange: amountMin,
                  maxRange: amountMax,
                  handleUpdateAmount: handleEditFilter,
                })}
              </div>
            </div>
          </DropdownMenuGroup>

          {/* Separator */}
          <div className="w-[2px] h-full bg-gray-300 mx-2"></div>

          {/* Right column filters */}
          <DropdownMenuGroup className="w-[240px]">
            <div className="w-full h-full flex flex-col justify-start items-start gap-[.8rem]">
              <div className="w-full flex flex-col gap-2">
                <Label>Date</Label>
                <DateRangePicker
                  date={filterParams.dateRange}
                  onChange={(values: DateRange | undefined) =>
                    handleEditFilter('dateRange', values)
                  }
                  colorScheme="default"
                />
              </div>

              {/* Account Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Account</Label>
                <div className="relative w-full h-fit">
                  {isLoading && <LoadingIndicator />}
                  <MultiSelect
                    options={categoryOptions}
                    selected={filterParams.accounts}
                    onChange={(values: string[]) => handleEditFilter('accounts', values)}
                    placeholder="Select Accounts"
                    className="w-full px-4 py-2"
                  />
                </div>
              </div>

              {/* Partner Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Partner</Label>
                <div className="relative w-full h-fit">
                  {isLoading && <LoadingIndicator />}
                  <MultiSelect
                    options={partnerOptions}
                    selected={filterParams.partners}
                    onChange={(values: string[]) => handleEditFilter('partners', values)}
                    placeholder="Select Partners"
                    className="w-full px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </DropdownMenuGroup>
        </div>

        {error && (
          <div className="w-full p-2 my-1 text-sm text-red-500">
            Error loading filter options. Please try again.
          </div>
        )}

        <DropdownMenuSeparator />
        <div className="w-full flex justify-end items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={'destructive'} className="px-3 py-2" onClick={handleResetFilter}>
                  <FunnelX className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Filter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="px-3 py-2" onClick={handleSaveFilterChanges}>
                  <Check className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Apply</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
