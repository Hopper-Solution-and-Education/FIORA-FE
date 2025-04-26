'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type React from 'react';
import { memo, useState } from 'react';
import { throttle } from 'lodash';
import { IconDisplay } from '@/components/common/atoms/IconDisplay';

const THROTTLE_DELAY = 300;

interface StackYAxisTick {
  x: number;
  y: number;
  payload: any;
  processedData: any;
  callback?: (item: any) => void;
  setShowAll?: () => void;
}

const StackYAxisTick: React.FC<StackYAxisTick> = ({
  x,
  y,
  payload,
  processedData,
  callback,
  setShowAll,
}) => {
  const item = processedData[payload.index];
  const [isIconHovered, setIsIconHovered] = useState(false);

  const throttledCallback = throttle(
    (callback, item) => {
      callback(item);
    },
    THROTTLE_DELAY,
    { leading: true, trailing: false },
  );

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item?.isOthers && setShowAll) {
      setShowAll();
    } else if (callback && item) {
      throttledCallback(callback, item);
    }
  };

  return (
    <g transform={`translate(${x},${y})`}>
      <TooltipProvider>
        <Tooltip open={isIconHovered}>
          <TooltipTrigger asChild>
            <foreignObject
              x={-40}
              y={-16}
              width={32}
              height={32}
              onMouseEnter={() => setIsIconHovered(true)}
              onMouseLeave={() => setIsIconHovered(false)}
            >
              <IconDisplay
                icon={item?.icon || 'activity'}
                isHovered={isIconHovered}
                onClick={handleIconClick}
              />
            </foreignObject>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="text-xs p-1.5 bg-popover/95 backdrop-blur-sm border-border/50 shadow-md"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-900 dark:text-gray-300">{payload.value}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </g>
  );
};

export default memo(StackYAxisTick);
