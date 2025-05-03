import { debounce } from 'lodash';
import { ReactNode, useCallback, useState } from 'react';
import { formatCurrency } from '../../hooks/formatCurrency';
import { TransactionCurrency } from '../../utils/constants';

type SliderProps = {
  amountMin: number;
  amountMax: number;
  minRange: number;
  maxRange: number;
  handleUpdateAmount: (target: any, value: number) => void;
};

export const renderAmountSlider = (props: SliderProps): ReactNode => {
  const { amountMax, amountMin, handleUpdateAmount, maxRange, minRange } = props;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [amountParams, setAmountParams] = useState<{ min: number; max: number }>({
    min: amountMin,
    max: amountMax,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCallback(
    () =>
      debounce(() => {
        //Update the amount parameters only if the new value is different from the current value
        if (amountParams.min !== amountMin) {
          // Move min thumb if it's closer or equidistant
          handleUpdateAmount('amountMin', amountParams.min);
        }
        //Update the amount parameters only if the new value is different from the current value
        if (amountParams.max !== amountMax) {
          // Move max thumb if it's closer
          handleUpdateAmount('amountMax', amountParams.max);
        }
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amountParams],
  );

  // Handle drag events for slider thumbs
  const createDragHandler =
    (target: 'amountMin' | 'amountMax', minValue: number, maxValue: number) =>
    (e: React.MouseEvent) => {
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
  const handleMinThumbDrag = createDragHandler('amountMin', minRange, amountMax);
  // Max thumb drag handler
  const handleMaxThumbDrag = createDragHandler('amountMax', amountMin, maxRange);

  // Handle click on the track to move closest thumb
  const handleTrackClick = (e: React.MouseEvent) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const clickValue = Math.round(clickPosition * maxRange);

    // Determine which thumb is closer to click position
    const minThumbDistance = Math.abs(clickValue - amountMin);
    const maxThumbDistance = Math.abs(clickValue - amountMax);

    if (minThumbDistance <= maxThumbDistance) {
      // Move min thumb if it's closer or equidistant
      setAmountParams((prev) => ({
        ...prev,
        min: Math.max(minRange, Math.min(amountMax, clickValue)),
      }));
    } else {
      // Move max thumb if it's closer
      setAmountParams((prev) => ({
        ...prev,
        max: Math.max(amountMin, Math.min(maxRange, clickValue)),
      }));
    }
  };

  return (
    <div className="w-full px-2">
      <div className="relative h-5 flex items-center">
        {/* Base track with click handler */}
        <div
          className="absolute w-full bg-gray-200 h-1 rounded-full cursor-pointer"
          onClick={handleTrackClick}
        />

        {/* Selected range track */}
        <div
          className="absolute bg-primary h-1 rounded-full"
          style={{
            left: `${(amountMin / maxRange) * 100}%`,
            right: `${100 - (amountMax / maxRange) * 100}%`,
          }}
          onClick={handleTrackClick}
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
