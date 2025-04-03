import { ReactNode } from 'react';
import { formatCurrency } from '../hooks/formatCurrency';
import { TransactionCurrency } from '../utils/constants';

type SliderProps = {
  amountMin: number;
  amountMax: number;
  minRange: number;
  maxRange: number;
  handleUpdateAmount: (target: 'gte' | 'lte', value: number) => void;
};

export const renderAmountSlider = (props: SliderProps): ReactNode => {
  const { amountMax, amountMin, handleUpdateAmount, maxRange, minRange } = props;

  // Handle drag events for slider thumbs
  const createDragHandler =
    (target: 'gte' | 'lte', minValue: number, maxValue: number) => (e: React.MouseEvent) => {
      const slider = e.currentTarget.parentElement;

      const handleDrag = (moveEvent: MouseEvent) => {
        if (slider) {
          const rect = slider.getBoundingClientRect();
          const pos = (moveEvent.clientX - rect.left) / rect.width;
          const newValue = Math.max(minValue, Math.min(maxValue, Math.round(pos * maxRange)));
          handleUpdateAmount(target, newValue);
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
    };

  // Min thumb drag handler
  const handleMinThumbDrag = createDragHandler('gte', minRange, amountMax);
  // Max thumb drag handler
  const handleMaxThumbDrag = createDragHandler('lte', amountMin, maxRange);

  return (
    <div className="w-full px-2">
      {/* Range labels */}
      <div className="flex justify-between mb-1 text-xs">
        <span className="text-gray-500">{formatCurrency(minRange, TransactionCurrency.VND)}</span>
        <span className="text-gray-500">{formatCurrency(maxRange, TransactionCurrency.VND)}</span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Base track */}
        <div className="absolute w-full bg-gray-200 h-1 rounded-full" />

        {/* Selected range track */}
        <div
          className="absolute bg-primary h-1 rounded-full"
          style={{
            left: `${(amountMin / maxRange) * 100}%`,
            right: `${100 - (amountMax / maxRange) * 100}%`,
          }}
        />

        {/* Min value input */}
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={formatCurrency(amountMin, TransactionCurrency.VND)}
          onChange={(e) => handleUpdateAmount('gte', Number(e.target.value))}
          className="absolute w-full cursor-pointer opacity-0 h-5 z-10"
        />

        {/* Max value input */}
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={formatCurrency(amountMax, TransactionCurrency.VND)}
          onChange={(e) => handleUpdateAmount('lte', Number(e.target.value))}
          className="absolute w-full cursor-pointer opacity-0 h-5 z-10"
        />

        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${(amountMin / maxRange) * 100}% - 8px)` }}
          onMouseDown={handleMinThumbDrag}
        />

        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${(amountMax / maxRange) * 100}% - 8px)` }}
          onMouseDown={handleMaxThumbDrag}
        />
      </div>
    </div>
  );
};
