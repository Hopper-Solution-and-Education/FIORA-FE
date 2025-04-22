import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react'; // Filter icon
import { cn } from '@/shared/utils';

interface DropdownPosition {
  align?: 'start' | 'center' | 'end'; // Horizontal alignment
  side?: 'top' | 'bottom' | 'left' | 'right'; // Dropdown side relative to trigger
  sideOffset?: number; // Vertical/horizontal offset from trigger
  alignOffset?: number; // Additional offset along the alignment axis
}

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showFilter?: boolean;
  filterContent?: React.ReactNode; // Content for the filter dropdown
  className?: string; // For the entire search bar container
  inputClassName?: string; // For the input element
  filterButtonClassName?: string; // For the filter button
  dropdownClassName?: string; // For the dropdown content
  dropdownPosition?: DropdownPosition; // New prop for dropdown positioning
  id?: string;
  disabled?: boolean;
  [key: string]: any; // For additional input props
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange = () => {},
  onBlur,
  placeholder = 'Search...',
  leftIcon,
  rightIcon,
  showFilter = false,
  filterContent,
  className = '',
  inputClassName = '',
  filterButtonClassName = '',
  dropdownClassName = '',
  dropdownPosition = {
    align: 'end',
    side: 'bottom',
    sideOffset: 8,
    alignOffset: 0,
  },
  id,
  disabled = false,
  ...inputProps
}) => {
  const { align, side, sideOffset, alignOffset } = dropdownPosition;

  return (
    <div className={cn('relative flex items-center w-full', className)}>
      {/* Search Bar Container */}
      <div className="relative flex-1">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">{leftIcon}</div>
        )}

        {/* Input */}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          id={id}
          disabled={disabled}
          className={cn(
            'w-full',
            leftIcon ? 'pl-10' : 'pl-4',
            rightIcon ? 'pr-10' : showFilter ? 'pr-12' : 'pr-4',
            inputClassName,
          )}
          {...inputProps}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightIcon}</div>
        )}
      </div>

      {/* Filter Button with Dropdown */}
      {showFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('ml-2', filterButtonClassName)}
              disabled={disabled}
              aria-label="Toggle filter options"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          {filterContent && (
            <DropdownMenuContent
              className={cn('w-64 p-4', dropdownClassName)}
              align={align}
              side={side}
              sideOffset={sideOffset}
              alignOffset={alignOffset}
            >
              {filterContent}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      )}
    </div>
  );
};

export default memo(SearchBar);
