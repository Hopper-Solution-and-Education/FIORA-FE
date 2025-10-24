// components/common/forms/input/InputDropdown.tsx
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Icons } from '@/components/Icon';
import { Input } from '@/components/ui/input';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface InputDropdownProps {
  value?: number;
  label?: string;
  currency?: string;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  classContainer?: string;
  className?: string;
  error?: FieldError | null;
  /** max number of items visible in dropdown before scroll */
  maxDropdownHeight?: number;
  /** initial packages when value === 0 */
  initialPackages?: number[]; // optional override
  applyExchangeRate?: boolean;
}

const DEFAULT_PACKAGES = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export default function InputDropdown({
  value = 0,
  label,
  currency = '',
  onChange = () => {},
  onBlur,
  placeholder = 'Input',
  id,
  name,
  required,
  classContainer,
  className,
  error = null,
  maxDropdownHeight = 208,
  initialPackages = DEFAULT_PACKAGES,
  applyExchangeRate = false,
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

  // compute options depending on value
  const numericValue = Number(value || 0);
  const options: number[] = initialPackages;

  // sync localValue when value prop changes (only when not focused)
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(
        value && value > 0 ? formatCurrency(value, currency, { applyExchangeRate }) : '',
      );
    }
  }, [value, isFocused]);

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
    setIsFocused(true);
    setIsOpen(true);
    setHighlightIndex(-1);
  };

  // close dropdown on blur (delay to allow onMouseDown handler to run)
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setIsOpen(false);
      setHighlightIndex(-1);
      if (onBlur) onBlur();
    }, 100);
  };

  // update input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // allow only numbers and decimal dot if you want (here integer)
    const cleaned = raw.replace(/[^\d.]/g, '');
    setLocalValue(cleaned);
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(0);
    }
  };

  // selecting option (called from onMouseDown to run before blur)
  const handleSelect = (num: number) => {
    setLocalValue(String(num));
    onChange(num);
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
      setHighlightIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && options[highlightIndex] !== undefined) {
        handleSelect(options[highlightIndex]);
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

  return (
    <div ref={wrapperRef} className={cn('mb-4 relative', classContainer)}>
      {typeof (label as any) !== 'undefined' && (
        // Note: we keep label optional; user can pass label via props if needed
        <GlobalLabel text={(label as string) ?? undefined} htmlFor={id} required={required} />
      )}

      <Input
        id={id}
        name={name}
        ref={inputRef}
        value={
          isFocused
            ? localValue
            : localValue === ''
              ? numericValue === 0
                ? ''
                : formatCurrency(numericValue, currency)
              : localValue
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={numericValue === 0 && !localValue ? placeholder : ''}
        className={cn(error ? 'border-red-500' : '', className)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id ?? name ?? 'input'}-dropdown`}
        inputMode="numeric"
      />

      {/* Error message */}
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}

      {/* Dropdown */}
      <div
        id={`${id ?? name ?? 'input'}-dropdown`}
        role="listbox"
        aria-hidden={!isOpen}
        style={{
          width: dropdownWidth ?? '100%',
          maxHeight: maxDropdownHeight,
        }}
        className={cn(
          'absolute left-0 mt-1 border rounded-md bg-white dark:bg-slate-900 shadow-lg overflow-auto z-50 transition-all duration-200 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
      >
        {options.map((opt, idx) => {
          const isHighlighted = idx === highlightIndex;
          return (
            <div
              key={idx}
              role="option"
              aria-selected={numericValue === opt}
              onMouseDown={(e) => {
                // prevent blur before this handler, then handle selection
                e.preventDefault();
                handleSelect(opt);
              }}
              className={cn(
                'flex items-center gap-2 p-2 cursor-pointer select-none',
                isHighlighted ? 'bg-gray-100 dark:bg-slate-800' : '',
                numericValue === opt ? 'font-semibold' : '',
              )}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {currency !== '' && <Icons.walletPackageCard className="size-4" />}

              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {formatCurrency(opt, currency, {
                    applyExchangeRate,
                  })}
                </span>
                {numericValue === opt && <span className="text-sm opacity-80">✓</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
