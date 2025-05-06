import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { Filter } from 'lucide-react';
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
  onBlur?: () => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showFilterButton?: boolean;
  filterContent?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  filterButtonClassName?: string;
  dropdownClassName?: string;
  dropdownPosition?: DropdownPosition;
  id?: string;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  error?: string | null | undefined;

  isFilterDropdownOpen?: boolean;
  onFilterDropdownOpenChange?: (open: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange = () => {},
  onBlur,
  placeholder = 'Search...',
  leftIcon,
  rightIcon,
  showFilterButton = false,
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
  type,
  error,
  isFilterDropdownOpen,
  onFilterDropdownOpenChange,
  // -------------------------
  ...inputProps
}) => {
  const { align, side, sideOffset, alignOffset } = dropdownPosition;
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = isFilterDropdownOpen !== undefined;

  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = isControlled ? isFilterDropdownOpen : internalOpen;

  const onOpenChange = isControlled ? onFilterDropdownOpenChange : setInternalOpen;

  return (
    <div
      className={cn(
        'relative flex items-center w-full max-w-full',
        'sm:max-w-md md:max-lg lg:max-xl',
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
          type={type}
          id={id}
          disabled={disabled}
          className={cn(
            'w-full text-sm',
            leftIcon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4',
            rightIcon ? 'pr-8 sm:pr-10' : showFilterButton ? 'pr-10 sm:pr-12' : 'pr-3 sm:pr-4', // Sử dụng showFilterButton
            'text-sm sm:text-base',
            inputClassName,
            error ? 'border-destructive focus-visible:ring-destructive' : '',
          )}
          {...inputProps}
        />

        {/* Right Icon (custom or default) */}
        {rightIcon && (
          <div className={cn('absolute inset-y-0 right-0 flex items-center pr-2', 'sm:pr-3')}>
            {rightIcon}
          </div>
        )}
      </div>

      {/* Filter Button with Dropdown */}
      {showFilterButton && ( // Sử dụng showFilterButton để hiển thị/ẩn nút
        <DropdownMenu open={open} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'ml-1 h-8 w-8',
                'sm:ml-2 sm:h-9 sm:w-9',
                'back',
                filterButtonClassName,
                // Background colors for light and dark themes
                'bg-gray-300 hover:bg-gray-400',
                'dark:bg-gray-700 dark:hover:bg-gray-600',
              )}
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

      {/* Error Message */}
      {error && (
        <p
          className={cn(
            'absolute -bottom-5 left-0 text-sm font-medium text-destructive',
            'sm:-bottom-6',
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(SearchBar);
