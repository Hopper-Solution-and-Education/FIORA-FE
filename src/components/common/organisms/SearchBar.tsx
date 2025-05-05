import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { Filter, X } from 'lucide-react';
import React, { memo, useRef } from 'react';

interface DropdownPosition {
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  alignOffset?: number;
}

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showFilter?: boolean;
  filterContent?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  filterButtonClassName?: string;
  dropdownClassName?: string;
  dropdownPosition?: DropdownPosition;
  id?: string;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange = () => {},
  onClear,
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Default right icon: show X icon if ref has value and no custom rightIcon
  const defaultRightIcon =
    inputRef.current?.value && !rightIcon ? (
      <X className="h-5 w-5 text-gray-500 cursor-pointer" onClick={onClear} />
    ) : null;

  return (
    <div
      className={cn(
        'relative flex items-center w-full max-w-full',
        'sm:max-w-md md:max-w-lg lg:max-w-xl',
        className,
      )}
    >
      {/* Search Bar Container */}
      <div className="relative flex-1">
        {/* Left Icon */}
        {leftIcon && (
          <div className={cn('absolute inset-y-0 left-0 flex items-center pl-2', 'sm:pl-3')}>
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          id={id}
          disabled={disabled}
          className={cn(
            'w-full text-sm',
            leftIcon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4',
            rightIcon || defaultRightIcon
              ? 'pr-8 sm:pr-10'
              : showFilter
                ? 'pr-10 sm:pr-12'
                : 'pr-3 sm:pr-4',
            'text-sm sm:text-base',
            inputClassName,
          )}
          {...inputProps}
        />

        {/* Right Icon (custom or default) */}
        {(rightIcon || defaultRightIcon) && (
          <div className={cn('absolute inset-y-0 right-0 flex items-center pr-2', 'sm:pr-3')}>
            {rightIcon || defaultRightIcon}
          </div>
        )}
      </div>

      {/* Filter Button with Dropdown */}
      {showFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('ml-1 h-8 w-8', 'sm:ml-2 sm:h-9 sm:w-9', filterButtonClassName)}
              disabled={disabled}
              aria-label="Toggle filter options"
            >
              <Filter className={cn('h-4 w-4', 'sm:h-5 sm:w-5')} />
            </Button>
          </DropdownMenuTrigger>
          {filterContent && (
            <DropdownMenuContent
              className={cn('w-56 p-3', 'sm:w-64 sm:p-4', 'max-w-[90vw]', dropdownClassName)}
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
