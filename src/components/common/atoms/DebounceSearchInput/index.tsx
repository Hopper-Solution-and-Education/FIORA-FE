'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Loader2Icon, SearchIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/shared/utils';

export interface DebounceSearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
  isLoading?: boolean;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const DebounceSearchInput: React.FC<DebounceSearchInputProps> = ({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  label,
  debounceMs = 300,
  isLoading = false,
  className,
  inputClassName,
  disabled = false,
  autoFocus = false,
}) => {
  const id = useId();
  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal value with controlled value
  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(() => {
        onChange?.(newValue);
      }, debounceMs);
    },
    [onChange, debounceMs],
  );

  const handleClear = useCallback(() => {
    setInternalValue('');

    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Immediately notify parent
    onChange?.('');

    // Focus input after clear
    inputRef.current?.focus();
  }, [onChange]);

  const showClearButton = internalValue.length > 0 && !isLoading;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        {/* Search/Loading Icon */}
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SearchIcon className="size-4" />
          )}
          <span className="sr-only">{isLoading ? 'Loading' : 'Search'}</span>
        </div>

        {/* Input */}
        <Input
          ref={inputRef}
          id={id}
          type="text"
          value={internalValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          autoFocus={autoFocus}
          className={cn(
            'peer pl-9 pr-9',
            '[&::-webkit-search-cancel-button]:appearance-none',
            '[&::-webkit-search-decoration]:appearance-none',
            '[&::-webkit-search-results-button]:appearance-none',
            '[&::-webkit-search-results-decoration]:appearance-none',
            inputClassName,
          )}
        />

        {/* Clear Button */}
        {showClearButton && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 h-full w-9 rounded-l-none hover:bg-transparent"
          >
            <XIcon className="size-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default DebounceSearchInput;
