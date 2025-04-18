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
import { FunnelPlus, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { formatCurrency } from '../hooks/formatCurrency';
import { TransactionFilterCriteria, TransactionFilterOptionResponse } from '../types';
import { DEFAULT_TRANSACTION_FILTER_CRITERIA, TransactionCurrency } from '../utils/constants';
import { renderAmountSlider } from './renderSlider';

type FilterParams = {
  dateRange?: DateRange;
  types?: string[];
  partners?: string[];
  categories?: string[];
  accounts?: string[];
  amountMin?: number;
  amountMax?: number;
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

  const [filterParams, setFilterParams] = useState<FilterParams>(filterParamsInitState);

  const { data, isLoading } = useDataFetcher<TransactionFilterOptionResponse>({
    endpoint: isOpen ? '/api/transactions/options' : null,
    method: 'GET',
  });

  useEffect(() => {
    if (filterCriteria && isOpen) {
      // Initialize objects to collect filter values
      const types: Set<string> = new Set();
      const partners: Set<string> = new Set();
      const categories: Set<string> = new Set();
      const accounts: Set<string> = new Set();
      let currentAmountMin = amountMin;
      let currentAmountMax = amountMax;
      let dateFrom: Date | undefined;
      let dateTo: Date | undefined;

      // Process the filter structure
      if (filterCriteria.filters) {
        if (Array.isArray(filterCriteria.filters.AND)) {
          // Handle AND array structure
          filterCriteria.filters.AND.forEach((condition: any) => {
            // Direct conditions (not in OR)
            if (condition.type && typeof condition.type === 'string') {
              types.add(condition.type);
            }

            if (condition.partner?.name) {
              partners.add(condition.partner.name);
            }

            if (condition.fromAccount?.name) {
              categories.add(condition.fromAccount.name);
            }

            if (condition.fromCategory?.name) {
              categories.add(condition.fromCategory.name);
            }

            if (condition.toAccount?.name) {
              accounts.add(condition.toAccount.name);
            }

            if (condition.toCategory?.name) {
              accounts.add(condition.toCategory.name);
            }

            // Handle amount condition
            if (condition.amount) {
              if (condition.amount.gte !== undefined) {
                currentAmountMin = condition.amount.gte;
              }
              if (condition.amount.lte !== undefined) {
                currentAmountMax = condition.amount.lte;
              }
            }

            // Handle OR conditions
            if (condition.OR && Array.isArray(condition.OR)) {
              condition.OR.forEach((orItem: any) => {
                // Type OR conditions
                if (orItem.type) {
                  types.add(orItem.type);
                }

                // Partner OR conditions
                if (orItem.partner?.name) {
                  partners.add(orItem.partner.name);
                }

                // Handle nested OR structures for fromAccount/fromCategory
                if (orItem.OR && Array.isArray(orItem.OR)) {
                  orItem.OR.forEach((nestedItem: any) => {
                    if (nestedItem.fromAccount?.name) {
                      categories.add(nestedItem.fromAccount.name);
                    }
                    if (nestedItem.fromCategory?.name) {
                      categories.add(nestedItem.fromCategory.name);
                    }
                    if (nestedItem.toAccount?.name) {
                      accounts.add(nestedItem.toAccount.name);
                    }
                    if (nestedItem.toCategory?.name) {
                      accounts.add(nestedItem.toCategory.name);
                    }
                  });
                }
              });
            }
          });
        } else {
          // Handle legacy flat structure
          const flatFilters = filterCriteria.filters;

          // Process simple fields
          if (flatFilters.type) {
            types.add(flatFilters.type);
          }

          if (flatFilters.partner?.name) {
            partners.add(flatFilters.partner.name);
          }

          if (flatFilters.fromAccount?.name) {
            categories.add(flatFilters.fromAccount.name);
          }

          if (flatFilters.fromCategory?.name) {
            categories.add(flatFilters.fromCategory.name);
          }

          if (flatFilters.toAccount?.name) {
            accounts.add(flatFilters.toAccount.name);
          }

          if (flatFilters.toCategory?.name) {
            accounts.add(flatFilters.toCategory.name);
          }

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
      }

      // Update state with collected values
      setFilterParams({
        types: Array.from(types),
        partners: Array.from(partners),
        categories: Array.from(categories),
        accounts: Array.from(accounts),
        amountMin: currentAmountMin,
        amountMax: currentAmountMax,
        dateRange: dateFrom || dateTo ? { from: dateFrom, to: dateTo } : filterParams.dateRange,
      });
    }
  }, [filterCriteria, isOpen, amountMin, amountMax, filterParams.dateRange]);

  const handleClose = () => {
    setIsOpen(false);
    setFilterParams(filterParamsInitState);
  };

  const handeResetFilter = () => {
    callBack(DEFAULT_TRANSACTION_FILTER_CRITERIA);
    handleClose();
  };

  const handleEditFilter = (target: keyof FilterParams, value: any) => {
    const tmpFilterParams = { ...filterParams };
    tmpFilterParams[target] = value;
    setFilterParams(tmpFilterParams);
  };

  const handleSaveFilterChanges = () => {
    const tmpFilterCriteria = { ...filterCriteria };
    const updatedFilters: Record<string, any> = {};
    const andConditions: any[] = [];

    // Handle date range as an individual filter
    if (filterParams.dateRange?.from || filterParams.dateRange?.to) {
      updatedFilters.date = {
        gte: filterParams.dateRange?.from ? filterParams.dateRange?.from.toISOString() : null,
        lte: filterParams.dateRange?.to ? filterParams.dateRange?.to.toISOString() : null,
      } as any;
    }

    // Create separate OR conditions for each filter type
    // Types OR group
    if (filterParams.types?.length) {
      const typeConditions = filterParams.types.map((type) => ({ type }));
      andConditions.push({ OR: typeConditions });
    }

    // Partners OR group
    if (filterParams.partners?.length) {
      const partnerConditions = filterParams.partners.map((partner) => ({
        partner: { name: partner },
      }));
      andConditions.push({ OR: partnerConditions });
    }

    // Categories OR group
    if (filterParams.categories?.length) {
      const categoryConditions = filterParams.categories.map((from) => ({
        OR: [{ fromAccount: { name: from } }, { fromCategory: { name: from } }],
      }));
      andConditions.push({ OR: categoryConditions });
    }

    // Accounts OR group
    if (filterParams.accounts?.length) {
      const accountConditions = filterParams.accounts.map((to) => ({
        OR: [{ toAccount: { name: to } }, { toCategory: { name: to } }],
      }));
      andConditions.push({ OR: accountConditions });
    }

    // Amount as a separate condition
    andConditions.push({
      amount: {
        gte: filterParams.amountMin,
        lte: filterParams.amountMax,
      },
    });

    // Add AND conditions if there are any
    if (andConditions.length > 0) {
      updatedFilters.AND = andConditions;
    }

    callBack({
      ...tmpFilterCriteria,
      filters: updatedFilters,
    });
    handleClose();
  };

  const typeOptions = [
    { value: 'Expense', label: 'Expense' },
    { value: 'Income', label: 'Income' },
    { value: 'Transfer', label: 'Transfer' },
  ];

  const partnerOptions = useMemo(() => {
    return data
      ? [...data.data.partners].map((option: string) => ({
          value: option,
          label: option,
        }))
      : [{ label: 'No option available', value: 'none', disabled: true }];
  }, [data]);

  const accountOptions = useMemo(() => {
    return data
      ? [...data.data.accounts].map((option: string) => ({
          value: option,
          label: option,
        }))
      : [{ label: 'No option available', value: 'none', disabled: true }];
  }, [data]);

  const categoryOptions = useMemo(() => {
    return data
      ? [...data.data.categories].map((option: string) => ({
          value: option,
          label: option,
        }))
      : [{ label: 'No option available', value: 'none', disabled: true }];
  }, [data]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleClose}>
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

        {/* Filter contentss */}
        <div className="w-full h-fit max-h-[45vh] flex justify-start items-start p-2 pb-5">
          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[260px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-3">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Type</Label>
                <MultiSelect
                  options={typeOptions}
                  selected={filterParams.types ?? []}
                  onChange={(values: string[]) => handleEditFilter('types', values)}
                  placeholder="Select Types"
                  className="w-full px-4 py-2"
                />
              </div>

              {/* Account Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Category</Label>
                <div className="relative w-full h-fit">
                  {isLoading && (
                    <div className="w-fit h-fit absolute top-[50%] right-[15%] -translate-y-[25%] z-10">
                      <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
                    </div>
                  )}
                  <MultiSelect
                    options={accountOptions}
                    selected={filterParams.categories ?? []}
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
                          // disabled={isRegistering} // Disable during register period
                          value={
                            !isMinEditing
                              ? formatCurrency(
                                  filterParams.amountMin ?? 0,
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
                          {formatCurrency(
                            filterParams.amountMin ?? 0,
                            TransactionCurrency.VND,
                            false,
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Label>To</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Input
                          // disabled={isRegistering} // Disable during register period
                          value={
                            !isMaxEditing
                              ? formatCurrency(
                                  filterParams.amountMax ?? 0,
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
                          {formatCurrency(
                            filterParams.amountMax ?? 0,
                            TransactionCurrency.VND,
                            false,
                          )}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {renderAmountSlider({
                  amountMin: filterParams.amountMin ?? amountMin,
                  amountMax: filterParams.amountMax ?? amountMax,
                  minRange: amountMin,
                  maxRange: amountMax,
                  handleUpdateAmount: handleEditFilter,
                })}
              </div>
            </div>
          </DropdownMenuGroup>

          {/* Seperator */}
          <div className="w-[2px] h-full bg-gray-300 mx-2"></div>

          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[240px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
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
                {/* <GlobalForm
                  fields={[
                    // <CustomDateRangePicker name="date" value={dateRange} onChange={setDateRange} />,
                  ]}
                  onSubmit={() => {}}
                  schema={{} as any}
                  renderSubmitButton={() => <></>}
                /> */}
              </div>

              {/* Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Account</Label>
                <div className="relative w-full h-fit">
                  {isLoading && (
                    <div className="w-fit h-fit absolute top-[50%] right-[15%] -translate-y-[25%] z-10">
                      <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
                    </div>
                  )}
                  <MultiSelect
                    options={categoryOptions}
                    selected={filterParams.accounts ?? []}
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
                  {isLoading && (
                    <div className="w-fit h-fit absolute top-[50%] right-[15%] -translate-y-[25%] z-10">
                      <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
                    </div>
                  )}
                  <MultiSelect
                    options={partnerOptions}
                    selected={filterParams.partners ?? []}
                    onChange={(values: string[]) => handleEditFilter('partners', values)}
                    placeholder="Select Partners"
                    className="w-full px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </DropdownMenuGroup>
        </div>

        <DropdownMenuSeparator />
        <div className="w-full flex justify-end items-center gap-2">
          <Button
            variant={'secondary'}
            className="px-5 bg-red-100 hover:bg-red-200 text-red-600"
            onClick={handeResetFilter}
          >
            Clear Filter
          </Button>
          <Button className="px-5" onClick={handleSaveFilterChanges}>
            Apply
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
