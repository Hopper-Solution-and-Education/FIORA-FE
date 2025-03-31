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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { FunnelPlus } from 'lucide-react';
import { useState } from 'react';
import { DropdownOption, TransactionFilterCriteria } from '../types';
import { DEFAULT_TRANSACTION_FILTER_CRITERIA, MOCK_ACCOUNTS } from '../utils/constants';

type FilterMenuProps = {
  callBack: (newFilter: TransactionFilterCriteria) => void;
};

const FilterMenu = ({ callBack }: FilterMenuProps) => {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(10000);

  const handeRemoveFilterCriteria = () => {
    callBack(DEFAULT_TRANSACTION_FILTER_CRITERIA);
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 py-2">
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
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <h2 className="font-semibold">Filter & Settings</h2>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Filter contentss */}
        <div className="w-full h-fit flex justify-start items-start p-2">
          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[200px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-2">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Type</Label>
                <Select
                  name="Select Type"
                  // value={amountCurrency}
                  required
                  // onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Expense', 'Income', 'Transfer'].map((typeOption) => (
                      <SelectItem key={typeOption} value={typeOption.toString()}>
                        {typeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seperator */}
              <div className="w-[2px] h-full bg-gray-300 mx-4"></div>

              {/* Partner Filter */}
              <div className="w-full flex flex-col gap-2">
                <Label>Partner</Label>
                <Select
                  name="Select Partners"
                  // value={amountCurrency}
                  required
                  // onValueChange={(value) => setAmountCurrency(value as TransactionCurrency)}
                >
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Select Partners" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ACCOUNTS.map((option: DropdownOption, index: number) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DropdownMenuGroup>

          {/* Seperator */}
          <div className="w-[2px] h-full bg-gray-300 mx-4"></div>

          {/* Filter criteria */}
          <DropdownMenuGroup className="w-[200px]">
            {/* <h4 className="text-sm w-max">Filters</h4> */}
            <div className="w-full h-full flex flex-col justify-start items-start gap-4">
              {/* Type Filter */}
              <div className="w-full flex flex-col gap-3">
                <Label>Amount</Label>
                <div className="w-full mb-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span>0</span>
                    <span>10,000</span>
                  </div>
                  <div className="relative h-5 flex items-center">
                    <div className="absolute w-full bg-gray-200 h-1 rounded-full" />
                    <div
                      className="absolute bg-primary h-1 rounded-full"
                      style={{
                        left: `${(minValue / 10000) * 100}%`,
                        right: `${100 - (maxValue / 10000) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      value={minValue}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value <= maxValue) setMinValue(value);
                      }}
                      className="absolute w-full cursor-pointer opacity-0 h-5 z-10"
                    />
                    <input
                      type="range"
                      min={0}
                      max={10000}
                      value={maxValue}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= minValue) setMaxValue(value);
                      }}
                      className="absolute w-full cursor-pointer opacity-0 h-5 z-10"
                    />
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20"
                      style={{ left: `calc(${(minValue / 10000) * 100}% - 8px)` }}
                    />
                    <div
                      className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20"
                      style={{ left: `calc(${(maxValue / 10000) * 100}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs font-medium">
                    <span>{minValue}</span>
                    <span>{maxValue}</span>
                  </div>
                </div>
                <Input
                  type="number"
                  // disabled={isRegistering} // Disable during register period
                  // value={amountValue}
                  min={0}
                  placeholder="Min"
                  // onChange={handleAmountChange}
                  required
                  className={cn('w-full')}
                />
                <Input
                  type="number"
                  // disabled={isRegistering} // Disable during register period
                  // value={amountValue}
                  min={0}
                  placeholder="Max"
                  // onChange={handleAmountChange}
                  required
                  className={cn('w-full')}
                />
              </div>
            </div>
          </DropdownMenuGroup>
        </div>

        <DropdownMenuSeparator />
        <div className="w-full flex justify-end items-center gap-2">
          <Button variant={'outline'} className="px-5" onClick={handeRemoveFilterCriteria}>
            Clear Filter
          </Button>
          <Button className="px-5">Apply</Button>
        </div>
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Notifications</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
