import DateRangePicker from '@/components/common/atoms/DateRangePicker';
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
import useDataFetcher from '@/hooks/useDataFetcher';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { FunnelPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { formatCurrency } from '../hooks/formatCurrency';
import { TransactionFilterCriteria, TransactionFilterOptionResponse } from '../types';
import { DEFAULT_TRANSACTION_FILTER_CRITERIA, TransactionCurrency } from '../utils/constants';
import { renderAmountSlider } from './renderSlider';

type FilterMenuProps = {
  callBack: (newFilter: TransactionFilterCriteria) => void;
};

const FilterMenu = ({ callBack }: FilterMenuProps) => {
  const { amountMin, amountMax, filterCriteria } = useAppSelector((state) => state.transaction);
  const [tmpFilterCriteria, setTmpFilterCriteria] = useState<TransactionFilterCriteria>(
    {} as TransactionFilterCriteria,
  );
  const [isOpen, setIsOpen] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [partners, setPartners] = useState<string[]>([]);
  const [subjectFrom, setSubjectFrom] = useState<string[]>([]);
  const [subjectTo, setSubjectTo] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const { data } = useDataFetcher<TransactionFilterOptionResponse>({
    endpoint: isOpen ? '/api/transactions/options' : null,
    method: 'GET',
  });

  const handleClose = () => {
    setIsOpen(false);
    setTmpFilterCriteria(filterCriteria);
    setDateRange(undefined);
    setPartners([]);
    setSubjectFrom([]);
    setSubjectTo([]);
    setTypes([]);
  };

  useEffect(() => {
    if (filterCriteria) {
      setTmpFilterCriteria({
        ...filterCriteria,
        filters: {
          ...filterCriteria.filters,
          amount: {
            gte: amountMin,
            lte: amountMax,
          },
        },
      });

      //  Add existing filters to the state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCriteria, isOpen]);

  const handleUpdateAmount = (target: 'gte' | 'lte', value: number) => {
    // Check if the value is within the range
    if (value < amountMin || value > amountMax) {
      return; // Ignore the change if out of range
    }

    setTmpFilterCriteria((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        amount: {
          ...(prev.filters?.amount as any),
          [target]: value,
        },
      },
    }));
  };

  const handeResetFilter = () => {
    callBack(DEFAULT_TRANSACTION_FILTER_CRITERIA);
    handleClose();
  };

  const handleSaveFilterChanges = () => {
    const updatedFilters = { ...tmpFilterCriteria.filters };

    if (dateRange?.from || dateRange?.to) {
      updatedFilters.date = {
        gte: dateRange.from ? dateRange.from.toISOString() : null,
        lte: dateRange.to ? dateRange.to.toISOString() : null,
      } as any;
    }

    if (types.length > 0 || partners.length > 0 || subjectFrom.length > 0 || subjectTo.length > 0) {
      // Create filter objects
      const filterObjects = [];

      // Add type filters
      for (const type of types) {
        filterObjects.push({
          type: type,
        });
      }

      // Add partner filters
      for (const partner of partners) {
        filterObjects.push({
          partner: {
            name: partner,
          },
        });
      }

      // Add subject from filters
      for (const from of subjectFrom) {
        filterObjects.push({
          fromAccount: {
            name: from,
          },
          fromCategory: {
            name: from,
          },
        });
      }

      // Add subject to filters
      for (const to of subjectTo) {
        filterObjects.push({
          toAccount: {
            name: to,
          },
          toCategory: {
            name: to,
          },
        });
      }

      if (filterObjects.length > 0) {
        updatedFilters.OR = filterObjects as any;
      }
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
                  selected={types}
                  onChange={setTypes}
                  placeholder="Select types"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Partner Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Partner</Label>
                <MultiSelect
                  options={partnerOptions}
                  selected={partners}
                  onChange={setPartners}
                  placeholder="Select Partners"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Account/Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Subject (From)</Label>
                <MultiSelect
                  options={subjectFromOptions}
                  selected={subjectFrom}
                  onChange={setSubjectFrom}
                  placeholder="Select Subjects (From)"
                  className="w-full px-4 py-3"
                />
              </div>

              {/* Account/Category Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Subject (To)</Label>
                <MultiSelect
                  options={subjectToOptions}
                  selected={subjectTo}
                  onChange={setSubjectTo}
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
                <DateRangePicker date={dateRange} onChange={setDateRange} />
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
                  amountMin: (tmpFilterCriteria.filters?.amount as any)?.gte ?? amountMin,
                  amountMax: (tmpFilterCriteria.filters?.amount as any)?.lte ?? amountMax,
                  minRange: amountMin,
                  maxRange: amountMax,
                  handleUpdateAmount,
                })}
                <div className="w-full flex flex-col gap-2">
                  <Label>Min</Label>
                  <Input
                    // disabled={isRegistering} // Disable during register period
                    value={formatCurrency(
                      (tmpFilterCriteria.filters?.amount as any)?.gte ?? 0,
                      TransactionCurrency.VND,
                    )}
                    min={amountMin}
                    max={amountMax}
                    onFocus={(e) => e.target.select()}
                    placeholder="Min"
                    onChange={(e) =>
                      handleUpdateAmount('gte', Number(e.target.value.split(',').join('')))
                    }
                    required
                    className={cn('w-full')}
                  />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Label>Max</Label>
                  <Input
                    // disabled={isRegistering} // Disable during register period
                    value={formatCurrency(
                      (tmpFilterCriteria.filters?.amount as any)?.lte ?? 0,
                      TransactionCurrency.VND,
                    )}
                    min={amountMin}
                    max={amountMax}
                    placeholder="Max"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) =>
                      handleUpdateAmount('lte', Number(e.target.value.split(',').join('')))
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
