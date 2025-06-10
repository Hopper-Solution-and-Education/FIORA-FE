import React from 'react';
import { ProgressBarChartProps } from './types';

const ProgressBarChart: React.FC<ProgressBarChartProps> = ({
  currentTier,
  chartDimensions,
  colors,
  getXAxisPosition,
  getYAxisPosition,
}) => {
  const { balance = 0, spent = 0 } = currentTier;

  return (
    <>
      {/* Progress bars for X-axis (Spent) */}
      <div className="absolute bottom-20 left-[110px] w-[calc(100%-130px)]">
        {/* Background bar */}
        <div className="absolute left-0 flex items-center w-[calc(100%-10px)] z-10">
          <div className="w-full h-2.5" style={{ background: colors.xBg }} />
        </div>

        {/* Arrow head for X-axis */}
        {chartDimensions.width && (
          <div
            className="absolute 
              right-0 top-[5px] 
              -translate-y-1/2 w-0 h-0 
              border-y-[5px] border-l-[10px] 
              z-[11] border-y-transparent"
            style={{ borderLeftColor: colors.xBg }}
          />
        )}

        {/* Current value bar */}
        <div
          className="h-2.5 absolute left-0 top-0 transition-all duration-700 z-[12]"
          style={{
            width: chartDimensions.width ? `${getXAxisPosition(spent)}px` : 0,
            background: colors.x,
          }}
        />
      </div>

      {/* Progress bars for Y-axis (Balance) */}
      <div
        className={`
          absolute top-0 left-[110px] 
          h-[calc(100%-70px)]
          ${chartDimensions.height ? 'block' : 'hidden'}
        `}
      >
        {/* Arrow head for Y-axis */}
        {chartDimensions.height && (
          <div
            className={`
              absolute top-0 left-1/2 
              w-0 h-0 z-[11] 
              border-x-[5px] border-b-[10px] border-x-transparent
              ${chartDimensions.height ? 'block' : 'hidden'}
            `}
            style={{ borderBottomColor: colors.yBg }}
          />
        )}

        {/* Background bar */}
        <div
          className={`
            absolute flex items-end 
            w-[10px] z-[10] 
            top-[10px] 
            h-[calc(100%-12px)]
            ${chartDimensions.height ? 'block' : 'hidden'}
          `}
        >
          <div className="h-full w-2.5" style={{ background: colors.yBg }} />
        </div>

        {/* Current value bar */}
        <div
          className="w-2.5 absolute left-0 bottom-0 transition-all duration-700 z-[12]"
          style={{
            height: chartDimensions.height ? `${getYAxisPosition(balance)}px` : 0,
            background: colors.y,
          }}
        />
      </div>
    </>
  );
};

export default ProgressBarChart;
