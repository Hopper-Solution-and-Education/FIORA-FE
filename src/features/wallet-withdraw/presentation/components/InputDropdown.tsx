// components/common/forms/input/InputDropdown.tsx
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Icons } from '@/components/Icon';
import { Input } from '@/components/ui/input';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { OptionDropdown } from '../../types';
import checkInputNumber from '../../utils/checkInputNumber';

interface InputDropdownProps {
  value?: number;
  label?: string;
  currency?: string;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  classContainer?: string;
  className?: string;
  error?: FieldError | null;
  /** max number of items visible in dropdown before scroll */
  maxDropdownHeight?: number;
  /** initial packages when value === 0 */
  applyExchangeRate?: boolean;
  options: OptionDropdown[];
}

function InputDropdown({
  value = 0,
  label,
  currency = '',
  onChange = () => {},
  onBlur,
  placeholder = 'Input',
  name,
  required,
  classContainer,
  className,
  error = null,
  maxDropdownHeight = 228,
  applyExchangeRate = false,
  options,
}: InputDropdownProps) {
  const { formatCurrency } = useCurrencyFormatter();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // local value for editing when focused
  const [localValue, setLocalValue] = useState<string>(() =>
    value && value > 0 ? formatCurrency(value, currency, { applyExchangeRate }) : '',
  );
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [search, setSearch] = useState<string>('');
  const [optionDisplay, setOptionDisplay] = useState<OptionDropdown[]>(options);

  // sync localValue when value prop changes (only when not focused)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(
        value && value > 0 ? formatCurrency(value, currency, { applyExchangeRate }) : '',
      );
    }
  }, [value, isFocused]);

  // [HOT FIX] `localValue` automatically displays the `value` as 0 while the value remains unchanged
  useEffect(() => {
    if (value > 0 && localValue !== formatCurrency(value, currency, { applyExchangeRate })) {
      setLocalValue(formatCurrency(value, currency, { applyExchangeRate }));
    }
  }, [localValue]);

  // measure width of wrapper to match dropdown
  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) setDropdownWidth(wrapperRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // open dropdown on focus
  const handleFocus = () => {
    setLocalValue(value.toString());
    setIsFocused(true);
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  // close dropdown on blur (delay to allow onMouseDown handler to run)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setLocalValue(formatCurrency(value, currency, { applyExchangeRate }).toString());
        setIsFocused(false);
        setIsOpen(false);
        setHighlightIndex(-1);
        if (onBlur) onBlur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onBlur]);

  // Filter options
  const handleFilter = (value: string) => {
    if (value === '') {
      setOptionDisplay([...options]);
      return;
    }

    const filtered = options.filter((option) => option.label.toString().startsWith(value));

    setOptionDisplay(filtered);
  };

  // update input change
  const handleInputChange = (value: string) => {
    if (checkInputNumber(value)) {
      onChange(Number(value));
      handleFilter(value);
    }
  };

  // selecting option (called from onMouseDown to run before blur)
  const handleSelect = (option: OptionDropdown) => {
    setLocalValue(formatCurrency(Number(option.label), currency, { applyExchangeRate }).toString());
    onChange(Number(option.label));
    // close + blur
    setIsOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  // keyboard handling: arrow up/down, Enter, Escape
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, optionDisplay.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && optionDisplay[highlightIndex] !== undefined) {
        handleSelect(optionDisplay[highlightIndex]);
      } else {
        // Người dùng tự nhập
        const parsed = parseFloat(localValue || '');
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
        inputRef.current?.blur();
        setIsOpen(false);
        setIsFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const onSearch = (value: string) => {
    if (checkInputNumber(value)) {
      setSearch(value);
    }
  };

  useEffect(() => {
    if (options && options?.length > 0) {
      setOptionDisplay([...options]);
    }
  }, [options]);

  useEffect(() => {
    handleFilter(search);
  }, [search]);

  return (
    <div ref={wrapperRef} className={cn('mb-4 relative', classContainer)}>
      {typeof (label as any) !== 'undefined' && (
        // Note: we keep label optional; user can pass label via props if needed
        <GlobalLabel
          text={(label as string) ?? undefined}
          htmlFor="withdraw-fx-input-dropdown"
          required={required}
        />
      )}

      <Input
        id="withdraw-fx-input-dropdown"
        name={name}
        ref={inputRef}
        value={isFocused ? (value > 0 ? value : '') : value > 0 ? localValue : ''}
        onFocus={handleFocus}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(error ? 'border-red-500' : '', className)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${name ?? 'input'}-dropdown`}
        inputMode="numeric"
      />

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}

      {/* Dropdown */}
      <div
        id={`${name ?? 'input'}-dropdown`}
        role="listbox"
        aria-hidden={!isOpen}
        style={{
          width: dropdownWidth ?? '100%',
          maxHeight: maxDropdownHeight,
        }}
        className={cn(
          'absolute left-0 mt-[6px] border rounded-md bg-white dark:bg-slate-900 shadow-lg overflow-auto z-50 transition-all duration-200 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
      >
        <div className="h-fit flex items-center border-b-1 relative">
          <Icons.search className="absolute size-4 left-2 text-gray-500" />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="flex-1 border-t-0 border-l-0 border-r-0 border-b-1 rounded-none shadow-none outline-none focus-visible:ring-0 focus-visible:ring-ring pl-8"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            inputMode="numeric"
            tabIndex={0}
          />
        </div>
        <div className="p-1">
          {optionDisplay.length > 0 ? (
            optionDisplay.map((opt, idx) => {
              const isHighlighted = idx === highlightIndex;
              return (
                <div
                  key={idx}
                  role="option"
                  onMouseDown={(e) => {
                    // prevent blur before this handler, then handle selection
                    e.preventDefault();
                    handleSelect(opt);
                  }}
                  className={cn(
                    'flex items-center gap-2 p-2 cursor-pointer select-none rounded',
                    isHighlighted ? 'bg-gray-100 dark:bg-slate-800' : '',
                  )}
                  onMouseEnter={() => setHighlightIndex(idx)}
                >
                  {currency !== '' && <Icons.walletPackageCard className="size-4" />}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {formatCurrency(Number(opt.label), currency, {
                        applyExchangeRate,
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-sm py-6 text-center">No option found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputDropdown;
