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
  const isChild = item?.isChild;
  const hasChildren = !isChild && item?.children && item.children.length > 0;
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

  // Function to truncate text longer than 10 characters
  const truncateText = (text: string) => {
    if (text.length > 10) {
      return text.substring(0, 10) + '...';
    }
    return text;
  };

  const displayText = truncateText(payload.value);
  const fullText = payload.value;

  return (
    <g
      transform={`translate(${x},${y})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TooltipProvider>
        {/* Label text with styling based on hierarchy and truncation */}
        <Tooltip>
          <TooltipTrigger asChild>
            <text
              x={hasChildren ? -55 : -25}
              y={0}
              dy={4}
              textAnchor="end"
              className={cn(
                'fill-current text-xs transition-all duration-200',
                isChild ? 'text-muted-foreground' : 'text-foreground',
                hasChildren && 'font-semibold',
                isHovered && 'translate-x-1 text-primary',
              )}
            >
              {displayText}
            </text>
          </TooltipTrigger>
          {fullText.length > 10 && (
            <TooltipContent side="left" align="center" className="text-xs p-1">
              {fullText}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Arrow button for expanding/collapsing (only for parents with children) */}
        {hasChildren && (
          <Tooltip>
            <TooltipTrigger asChild>
              <foreignObject
                x={-20}
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

        {/* Edit button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <foreignObject
              x={hasChildren ? -45 : -20}
              y={-8}
              width={16}
              height={16}
              className="overflow-visible cursor-pointer"
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-4 w-4 p-0 rounded-full transition-all duration-200',
                  isHovered ? 'bg-primary/20 scale-110 rotate-12' : 'hover:bg-muted/60',
                )}
                onClick={handleEditClick}
              >
                <Icons.settings
                  className={cn(
                    'h-3 w-3 transition-all duration-200',
                    isHovered ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
              </Button>
            </foreignObject>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="text-xs">
            Edit item
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </g>
  );
};

export default CustomYAxisTick;
