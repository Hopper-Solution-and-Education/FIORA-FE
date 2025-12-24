'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Icons } from '@/components/Icon';
import { Input } from '@/components/ui/input';
import { useDropdownKeyboard } from '@/features/sending/hooks/useDropdownKeyboard';
import { DEFAULT_AMOUNT_PACKAGES } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn } from '@/shared/utils';
import React, { useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface AmountInputDropdownProps {
  label?: string;
  value?: number;
  currency?: string;
  onChange?: (val: number) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
  error?: FieldError | null;
  classContainer?: string;
  className?: string;
  maxDropdownHeight?: number;
  initialPackages?: number[];
  applyExchangeRate?: boolean;
}

export default function AmountInputDropdown({
  label,
  value = 0,
  currency = '',
  onChange = () => {},
  onBlur,
  placeholder = 'Enter amount',
  id,
  name,
  required,
  error = null,
  classContainer,
  className,
  maxDropdownHeight = 208,
  initialPackages = DEFAULT_AMOUNT_PACKAGES,
  applyExchangeRate = false,
}: AmountInputDropdownProps) {
  const { formatCurrency } = useCurrencyFormatter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [localValue, setLocalValue] = useState<string>(
    value && value > 0 ? formatCurrency(value, currency, { applyExchangeRate }) : '',
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [dropdownWidth, setDropdownWidth] = useState<number>();

  const numericValue = Number(value || 0);
  const options = initialPackages;

  // 🧩 Focus on error
  useEffect(() => {
    if (error && inputRef?.current) {
      inputRef.current.focus();
    }
  }, [error]);

  // 🧩 Sync external value
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(
        value && value > 0 ? formatCurrency(value, currency, { applyExchangeRate }) : '',
      );
    }
  }, [value, isFocused]);

  // 🧩 Measure dropdown width to align perfectly
  useEffect(() => {
    const measure = () => {
      if (wrapperRef.current) setDropdownWidth(wrapperRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setIsOpen(false);
      setHighlightIndex(-1);
      onBlur?.();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    setLocalValue(raw);
    const parsed = parseFloat(raw);
    onChange(!isNaN(parsed) ? parsed : 0);
  };

  const handleSelect = (num: number) => {
    setLocalValue(String(num));
    onChange(num);
    setIsOpen(false);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = useDropdownKeyboard<number>({
    isOpen,
    options,
    highlightIndex,
    setHighlightIndex,
    setIsOpen,
    handleSelect,
    inputRef: inputRef as React.RefObject<HTMLInputElement>,
    localValue,
    onChange,
    setIsFocused,
  });

  return (
    <div ref={wrapperRef} className={cn('relative mb-4 w-full', classContainer)}>
      {label && <GlobalLabel text={label} htmlFor={id} required={required} />}

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
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(
          error ? 'border-red-500 focus-visible:ring-0' : 'focus-visible:ring-1',
          className,
        )}
        inputMode="numeric"
        aria-expanded={isOpen}
      />

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}

      {/* Dropdown */}
      <div
        className={cn(
          'absolute left-0 mt-1 border rounded-md bg-white dark:bg-slate-900 shadow-lg overflow-auto z-50 transition-all duration-200 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        style={{
          width: dropdownWidth ?? '100%',
          maxHeight: maxDropdownHeight,
        }}
      >
        {options.map((opt, idx) => {
          const isHighlighted = idx === highlightIndex;
          return (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-2 p-2 cursor-pointer select-none',
                isHighlighted ? 'bg-gray-100 dark:bg-slate-800' : '',
                numericValue === opt ? 'font-semibold' : '',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(opt);
              }}
              onMouseEnter={() => setHighlightIndex(idx)}
            >
              {currency && <Icons.walletPackageCard className="size-4" />}
              <span className="text-sm">
                {formatCurrency(opt, currency, { applyExchangeRate })}
              </span>
              {numericValue === opt && <span className="text-sm opacity-80">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
