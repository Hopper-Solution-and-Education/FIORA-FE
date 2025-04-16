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
import { FunnelPlus } from 'lucide-react';
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
  subjectFrom?: string[];
  subjectTo?: string[];
  amountMin?: number;
  amountMax?: number;
};

const filterParamsInitState: FilterParams = {
  dateRange: undefined,
  types: [],
  partners: [],
  subjectFrom: [],
  subjectTo: [],
  amountMin: 0,
  amountMax: 10000,
};

type FilterMenuProps = {
  callBack: (newFilter: TransactionFilterCriteria) => void;
};

const FilterMenu = ({ callBack }: FilterMenuProps) => {
  const { amountMin, amountMax, filterCriteria } = useAppSelector((state) => state.transaction);

  const [isOpen, setIsOpen] = useState(false);

  const [filterParams, setFilterParams] = useState<FilterParams>(filterParamsInitState);

  const { data } = useDataFetcher<TransactionFilterOptionResponse>({
    endpoint: isOpen ? '/api/transactions/options' : null,
    method: 'GET',
  });

  useEffect(() => {
    if (filterCriteria && isOpen) {
      if (!filterCriteria.filters['OR']) {
        const tmpFilterParams = filterCriteria.filters;
        setFilterParams({
          types: tmpFilterParams?.type ? [tmpFilterParams?.type] : [],
          partners: tmpFilterParams?.partner?.name ? [tmpFilterParams?.partner?.name] : [],
          subjectFrom:
            tmpFilterParams?.fromAccount?.name || tmpFilterParams.fromCategory?.name
              ? [tmpFilterParams?.fromAccount?.name ?? tmpFilterParams.fromCategory?.name]
              : [],
          subjectTo:
            tmpFilterParams?.toAccount?.name || tmpFilterParams.toCategory?.name
              ? [tmpFilterParams?.toAccount?.name ?? tmpFilterParams.toCategory?.name]
              : [],
          amountMin: amountMin,
          amountMax: amountMax,
          dateRange: tmpFilterParams?.date
            ? {
                from: tmpFilterParams.date.gte ? new Date(tmpFilterParams.date.gte) : undefined,
                to: tmpFilterParams.date.lte ? new Date(tmpFilterParams.date.lte) : undefined,
              }
            : undefined,
        });
      } else {
        const tmpFilterOrParams = filterCriteria.filters['OR'];
        type FilterOrValue = {
          type?: string;
          partner?: { name: string };
          fromAccount?: { name: string };
          fromCategory?: { name: string };
          toAccount?: { name: string };
          toCategory?: { name: string };
        };

        // Initialize aggregated values
        const types = new Set<string>();
        const partners = new Set<string>();
        const subjectFrom = new Set<string>();
        const subjectTo = new Set<string>();
        let currentAmountMin = amountMin;
        let currentAmountMax = amountMax;

        // Process all OR conditions at once
        tmpFilterOrParams.forEach((filterValue: FilterOrValue) => {
          if ('type' in filterValue && filterValue.type) {
            types.add(filterValue.type);
          }

          if ('partner' in filterValue && filterValue.partner?.name) {
            partners.add(filterValue.partner.name);
          }

          if ('fromAccount' in filterValue && filterValue.fromAccount?.name) {
            subjectFrom.add(filterValue.fromAccount.name);
          }

          if ('fromCategory' in filterValue && filterValue.fromCategory?.name) {
            subjectFrom.add(filterValue.fromCategory.name);
          }

          if ('toAccount' in filterValue && filterValue.toAccount?.name) {
            subjectTo.add(filterValue.toAccount.name);
          }

          if ('toCategory' in filterValue && filterValue.toCategory?.name) {
            subjectTo.add(filterValue.toCategory.name);
          }

          // Check for amount filter in current OR condition
          if ('amount' in filterValue && filterValue.amount) {
            const amountFilter = filterValue.amount as { gte?: number; lte?: number };
            if (amountFilter.gte !== undefined) {
              currentAmountMin = amountFilter.gte;
            }
            if (amountFilter.lte !== undefined) {
              currentAmountMax = amountFilter.lte;
            }
          }
        });

        setFilterParams({
          types: Array.from(types),
          partners: Array.from(partners),
          subjectFrom: Array.from(subjectFrom),
          subjectTo: Array.from(subjectTo),
          amountMin: currentAmountMin,
          amountMax: currentAmountMax,
          dateRange: filterParams.dateRange,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCriteria, isOpen, amountMin, amountMax]);

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

    if (filterParams.dateRange?.from || filterParams.dateRange?.to) {
      updatedFilters.date = {
        gte: filterParams.dateRange?.from ? filterParams.dateRange?.from.toISOString() : null,
        lte: filterParams.dateRange?.to ? filterParams.dateRange?.to.toISOString() : null,
      } as any;
    }

    // Handle all filter params at once
    // ['types', 'partners', 'subjectFrom', 'subjectTo'].forEach(field => {
    //   const key = field as keyof FilterParams;
    //   if (filterParams[key]?.length) {
    //   handleFieldChange(key, filterParams[key]);
    //   }
    // });

    // Create the OR filter conditions
    const orConditions: any[] = [];

    // Add conditions based on filter parameters
    if (filterParams.types?.length) {
      filterParams.types.forEach((type) => orConditions.push({ type }));
    }

    if (filterParams.partners?.length) {
      filterParams.partners.forEach((partner) => orConditions.push({ partner: { name: partner } }));
    }

    if (filterParams.subjectFrom?.length) {
      filterParams.subjectFrom.forEach((from) =>
        orConditions.push({
          fromAccount: { name: from },
          fromCategory: { name: from },
        }),
      );
    }

    if (filterParams.subjectTo?.length) {
      filterParams.subjectTo.forEach((to) =>
        orConditions.push({
          toAccount: { name: to },
          toCategory: { name: to },
        }),
      );
    }

    orConditions.push({
      amount: {
        gte: filterParams.amountMin,
        lte: filterParams.amountMax,
      },
    });

    // Only add OR conditions if there are any
    if (orConditions.length > 0) {
      updatedFilters.OR = orConditions as any;
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

  const subjectFromOptions = useMemo(() => {
    return data
      ? [...data.data.fromAccounts, ...data.data.fromCategories].map((option: string) => ({
          value: option,
          label: option,
        }))
      : [{ label: 'No option available', value: 'none', disabled: true }];
  }, [data]);

  const subjectToOptions = useMemo(() => {
    return data
      ? [...data.data.toAccounts, ...data.data.toCategories].map((option: string) => ({
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
        <div className="w-full h-fit max-h-[45vh] overflow-y-auto flex justify-start items-start p-2 ">
          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[220px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-3">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Type</Label>
                <MultiSelect
                  options={typeOptions}
                  selected={filterParams.types ?? []}
                  onChange={(values: string[]) => handleEditFilter('types', values)}
                  placeholder="Select types"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Partner Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Partner</Label>
                <MultiSelect
                  options={partnerOptions}
                  selected={filterParams.partners ?? []}
                  onChange={(values: string[]) => handleEditFilter('partners', values)}
                  placeholder="Select Partners"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Account/Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Subject (From)</Label>
                <MultiSelect
                  options={subjectFromOptions}
                  selected={filterParams.subjectFrom ?? []}
                  onChange={(values: string[]) => handleEditFilter('subjectFrom', values)}
                  placeholder="Select Subjects (From)"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Account/Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Subject (To)</Label>
                <MultiSelect
                  options={subjectToOptions}
                  selected={filterParams.subjectTo ?? []}
                  onChange={(values: string[]) => handleEditFilter('subjectTo', values)}
                  placeholder="Select Subjects (To)"
                  className="w-full px-4 py-3"
                />
              </div>
            </div>
          </DropdownMenuGroup>

          {/* Seperator */}
          <div className="w-[2px] h-full bg-gray-300 mx-2"></div>

          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[250px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-[.8rem]">
              <div className="w-full flex flex-col gap-2">
                <Label>Date range</Label>
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

              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Amount</Label>
                {renderAmountSlider({
                  amountMin: filterParams.amountMin ?? amountMin,
                  amountMax: filterParams.amountMax ?? amountMax,
                  minRange: amountMin,
                  maxRange: amountMax,
                  handleUpdateAmount: handleEditFilter,
                })}
                <div className="w-full flex flex-col gap-2">
                  <Label>Min</Label>
                  <Input
                    // disabled={isRegistering} // Disable during register period
                    value={formatCurrency(filterParams.amountMin ?? 0, TransactionCurrency.VND)}
                    min={amountMin}
                    max={amountMax}
                    onFocus={(e) => e.target.select()}
                    placeholder="Min"
                    onChange={(e) =>
                      handleEditFilter('amountMin', Number(e.target.value.split(',').join('')))
                    }
                    required
                    className={cn('w-full')}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Label>Max</Label>
                  <Input
                    // disabled={isRegistering} // Disable during register period
                    value={formatCurrency(filterParams.amountMax ?? 0, TransactionCurrency.VND)}
                    min={amountMin}
                    max={amountMax}
                    placeholder="Max"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      handleEditFilter('amountMax', Number(e.target.value.split(',').join('')))
                    }
                    required
                    className={cn('w-full')}
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
