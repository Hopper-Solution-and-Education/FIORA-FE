'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import type React from 'react';
import { memo, useState } from 'react';
import { throttle } from 'lodash';
import { IconDisplay } from '@/components/common/atoms/IconDisplay';

const THROTTLE_DELAY = 300;

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: any;
  processedData: any;
  expandedItems: any;
  onToggleExpand: (name: string) => void;
  callback?: (item: any) => void;
  setShowAll?: () => void;
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({
  x,
  y,
  payload,
  processedData,
  expandedItems,
  onToggleExpand,
  callback,
  setShowAll,
}) => {
  const item = processedData[payload.index];
  const hasChildren = item?.children && item.children.length > 0;
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const throttledToggleExpand = throttle(
    (onToggleExpand, value) => {
      onToggleExpand(value);
    },
    THROTTLE_DELAY,
    { leading: true, trailing: false },
  );

  const throttledCallback = throttle(
    (callback, item) => {
      callback(item);
    },
    THROTTLE_DELAY,
    { leading: true, trailing: false },
  );

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      throttledToggleExpand(onToggleExpand, payload.value);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
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
        {/* Icon with tooltip that shows on hover */}
        <Tooltip open={isIconHovered}>
          <TooltipTrigger asChild>
            <foreignObject
              x={-70}
              y={-16}
              width={32}
              height={32}
              onMouseEnter={() => setIsIconHovered(true)}
              onMouseLeave={() => setIsIconHovered(false)}
            >
              <IconDisplay
                icon={item?.icon || 'activity'}
                isHovered={isIconHovered}
                className={cn(expandedItems[payload.value] && 'bg-primary/10')}
                onClick={handleEditClick}
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

        {/* Expand/collapse button with tooltip */}
        {hasChildren && (
          <Tooltip open={isButtonHovered}>
            <TooltipTrigger asChild>
              <foreignObject
                x={-20}
                y={-8}
                width={16}
                height={16}
                className="cursor-pointer overflow-visible"
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-4 w-4 p-0 rounded-full transition-all duration-300',
                    isButtonHovered ? 'bg-primary/20 scale-110' : 'hover:bg-muted/60',
                    expandedItems[payload.value] && 'bg-primary/10',
                  )}
                  onClick={handleArrowClick}
                >
                  {expandedItems[payload.value] ? (
                    <Icons.circleChevronUp
                      className={cn(
                        'h-3 w-3 transition-all duration-200',
                        isButtonHovered && 'text-primary scale-110',
                        expandedItems[payload.value] ? 'text-primary/80' : 'text-muted-foreground',
                      )}
                    />
                  ) : (
                    <Icons.circleChevronDown
                      className={cn(
                        'h-3 w-3 transition-all duration-200',
                        isButtonHovered && 'text-primary scale-110',
                      )}
                    />
                  )}
                </Button>
              </foreignObject>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="text-xs p-1.5 bg-popover/95 backdrop-blur-sm border-border/50 shadow-md"
            >
              <span className="font-medium text-gray-900 dark:text-gray-300">
                {expandedItems[payload.value] ? 'Collapse' : 'Expand'}
              </span>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </g>
  );
};

export default memo(CustomYAxisTick);
