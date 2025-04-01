'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { cn } from '@/shared/utils';
import type React from 'react';
import { useState } from 'react';

import { throttle } from 'lodash';

const THROTTLE_DELAY = 300; // Độ trễ giữa các lần gọi (ms)

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: any;
  processedData: any;
  expandedItems: any;
  onToggleExpand: (name: string) => void;
  callback?: (item: any) => void;
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({
  x,
  y,
  payload,
  processedData,
  expandedItems,
  onToggleExpand,
  callback,
}) => {
  const item = processedData.find((d: any) => d.name === payload.value);
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
    if (callback && item) {
      console.log(item);
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
              {/* Circular icon */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 p-0 rounded-full border transition-all duration-300',
                  isIconHovered ? 'bg-primary/20 shadow-sm' : 'hover:bg-muted/60',
                  expandedItems[payload.value] && 'bg-primary/10',
                )}
                onClick={handleEditClick}
              >
                <LucieIcon
                  icon={item?.icon || 'activity'}
                  className={cn(
                    'h-4 w-4 transition-all duration-200',
                    isIconHovered ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </Button>
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

export default CustomYAxisTick;
