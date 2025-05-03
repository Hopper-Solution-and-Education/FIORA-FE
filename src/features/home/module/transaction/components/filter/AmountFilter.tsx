import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { useState } from 'react';
import { formatCurrency } from '../../hooks/formatCurrency';
import { TransactionCurrency } from '../../utils/constants';
import { renderAmountSlider } from './renderAmountSlider';

interface AmountFilterProps {
  amountMin: number;
  amountMax: number;
  minRange: number;
  maxRange: number;
  onAmountChange: (target: 'amountMin' | 'amountMax', value: number) => void;
}

const AmountFilter = ({
  amountMin,
  amountMax,
  minRange,
  maxRange,
  onAmountChange,
}: AmountFilterProps) => {
  const [isMinEditing, setIsMinEditing] = useState(false);
  const [isMaxEditing, setIsMaxEditing] = useState(false);

  return (
    <div className="w-full flex flex-col gap-2">
      <Label>Amount</Label>
      <div className="w-full flex flex-row items-center justify-between gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                value={
                  !isMinEditing
                    ? formatCurrency(amountMin, TransactionCurrency.VND, false)
                    : amountMin
                }
                min={minRange}
                max={maxRange}
                onFocus={(e) => {
                  setIsMinEditing(true);
                  e.target.select();
                }}
                onBlur={() => setIsMinEditing(false)}
                placeholder="Min"
                onChange={(e) =>
                  onAmountChange('amountMin', Number(e.target.value.split(',').join('')))
                }
                required
                className={cn('w-[40%]')}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatCurrency(amountMin, TransactionCurrency.VND, false)}</p>
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
                    ? formatCurrency(amountMax, TransactionCurrency.VND, false)
                    : amountMax
                }
                min={minRange}
                max={maxRange}
                placeholder="Max"
                onFocus={(e) => {
                  setIsMaxEditing(true);
                  e.target.select();
                }}
                onBlur={() => setIsMaxEditing(false)}
                onChange={(e) =>
                  onAmountChange('amountMax', Number(e.target.value.split(',').join('')))
                }
                required
                className={cn('w-[60%]')}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{formatCurrency(amountMax, TransactionCurrency.VND, false)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {renderAmountSlider({
        amountMin: amountMin,
        amountMax: amountMax,
        minRange: minRange,
        maxRange: maxRange,
        handleUpdateAmount: onAmountChange,
      })}
    </div>
  );
};

export default AmountFilter;
