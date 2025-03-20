import React from 'react';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';

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
  const depth = item?.depth || 0;
  const hasChildren = item?.children && item.children.length > 0;
  const [isHovered, setIsHovered] = React.useState(false);

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggleExpand(payload.value);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (callback && item) {
      callback(item);
    }
  };

  // Truncate text longer than 15 characters
  const truncateText = (text: string) => {
    if (text.length > 15) {
      return text.substring(0, 15) + '...';
    }
    return text;
  };

  const displayText = truncateText(payload.value);
  const fullText = payload.value;

  // Calculate text and button positions based on depth
  const textX = hasChildren ? -50 + 10 : -30 + 10;
  const buttonX = hasChildren ? -40 + 10 : undefined;

  return (
    <g
      transform={`translate(${x},${y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TooltipProvider>
        {/* Label text with dynamic positioning */}
        <Tooltip>
          <TooltipTrigger asChild onClick={handleEditClick}>
            <text
              x={textX}
              y={0}
              dy={4}
              textAnchor="end"
              className={cn(
                'fill-current text-xs transition-all duration-200 text-foreground cursor-pointer',
                isHovered && 'translate-x-1 text-primary font-semibold',
              )}
            >
              {displayText}
            </text>
          </TooltipTrigger>
          {fullText.length > 15 && (
            <TooltipContent side="left" align="center" className="text-xs p-1">
              {fullText}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Expand/collapse button for items with children */}
        {hasChildren && (
          <Tooltip>
            <TooltipTrigger asChild>
              <foreignObject
                x={buttonX}
                y={-8}
                width={16}
                height={16}
                className="cursor-pointer overflow-visible"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-4 w-4 p-0 rounded-full transition-all duration-200',
                    isHovered ? 'bg-primary/20 scale-110' : 'hover:bg-muted/60',
                  )}
                  onClick={handleArrowClick}
                >
                  {expandedItems[payload.value] ? (
                    <Icons.circleChevronUp
                      className={cn(
                        'h-3 w-3 transition-transform duration-200',
                        isHovered && 'text-primary scale-110',
                      )}
                    />
                  ) : (
                    <Icons.circleChevronDown
                      className={cn(
                        'h-3 w-3 transition-transform duration-200',
                        isHovered && 'text-primary scale-110',
                      )}
                    />
                  )}
                </Button>
              </foreignObject>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="text-xs">
              {expandedItems[payload.value] ? 'Collapse' : 'Expand'}
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </g>
  );
};

export default CustomYAxisTick;
