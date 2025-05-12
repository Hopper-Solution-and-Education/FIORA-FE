import React from 'react';

interface RenderRangeSliderProps {
  minValue: number;
  maxValue: number;
  minRange: number;
  maxRange: number;
  handleUpdate: (target: 'minValue' | 'maxValue', value: number) => void;
  step?: number;
  formatValue?: (value: number) => string;
}

export const renderRangeSlider = ({
  minValue,
  maxValue,
  minRange,
  maxRange,
  handleUpdate,
  step = 1,
  formatValue,
}: RenderRangeSliderProps) => {
  // Create drag handlers for slider thumbs
  const createDragHandler =
    (target: 'minValue' | 'maxValue', minLimit: number, maxLimit: number) =>
    (e: React.MouseEvent) => {
      const slider = e.currentTarget.parentElement;

      const handleDrag = (moveEvent: MouseEvent) => {
        if (slider) {
          const rect = slider.getBoundingClientRect();
          const pos = (moveEvent.clientX - rect.left) / rect.width;

          // Calculate value with respect to the range and step
          let newValue = pos * (maxRange - minRange) + minRange;

          // Apply step rounding for better precision with large numbers
          if (step > 1) {
            newValue = Math.round(newValue / step) * step;
          } else {
            newValue = Math.round(newValue);
          }

          // Apply limits
          newValue = Math.max(minLimit, Math.min(maxLimit, newValue));

          handleUpdate(target, newValue);
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
  const handleMinThumbDrag = createDragHandler('minValue', minRange, maxValue);
  // Max thumb drag handler
  const handleMaxThumbDrag = createDragHandler('maxValue', minValue, maxRange);

  // Handle click on the track to move closest thumb
  const handleTrackClick = (e: React.MouseEvent) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;

    // Calculate value with respect to the range and step
    let clickValue = clickPosition * (maxRange - minRange) + minRange;

    // Apply step rounding for better precision
    if (step > 1) {
      clickValue = Math.round(clickValue / step) * step;
    } else {
      clickValue = Math.round(clickValue);
    }

    // Determine which thumb is closer to click position
    const minThumbDistance = Math.abs(clickValue - minValue);
    const maxThumbDistance = Math.abs(clickValue - maxValue);

    if (minThumbDistance <= maxThumbDistance) {
      // Move min thumb if it's closer or equidistant
      handleUpdate('minValue', Math.max(minRange, Math.min(maxValue, clickValue)));
    } else {
      // Move max thumb if it's closer
      handleUpdate('maxValue', Math.max(minValue, Math.min(maxRange, clickValue)));
    }
  };

  // Calculate positions as percentages for CSS positioning
  const minValuePosition = ((minValue - minRange) / (maxRange - minRange)) * 100;
  const maxValuePosition = ((maxValue - minRange) / (maxRange - minRange)) * 100;

  return (
    <div className="w-[94%] mt-1">
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
            left: `${minValuePosition}%`,
            right: `${100 - maxValuePosition}%`,
          }}
        />

        {/* Min value input - hidden but used for accessibility */}
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={minValue}
          step={step}
          onChange={(e) => handleUpdate('minValue', Number(e.target.value))}
          className="absolute w-full cursor-pointer opacity-0 h-5"
          style={{ pointerEvents: 'none' }}
          aria-label="Minimum value"
        />

        {/* Max value input - hidden but used for accessibility */}
        <input
          type="range"
          min={minRange}
          max={maxRange}
          value={maxValue}
          step={step}
          onChange={(e) => handleUpdate('maxValue', Number(e.target.value))}
          className="absolute w-full cursor-pointer opacity-0 h-5"
          style={{ pointerEvents: 'none' }}
          aria-label="Maximum value"
        />

        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${minValuePosition}% - 8px)` }}
          onMouseDown={handleMinThumbDrag}
        />

        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full z-20 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${maxValuePosition}% - 8px)` }}
          onMouseDown={handleMaxThumbDrag}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">
          {formatValue ? formatValue(minValue) : minValue}
        </span>
        <span className="text-xs text-gray-500">
          {formatValue ? formatValue(maxValue) : maxValue}
        </span>
      </div>
    </div>
  );
};
