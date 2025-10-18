import { Currency } from '@prisma/client';
import { uniqueId } from 'lodash';
import React, { useMemo } from 'react';
import { FieldError } from 'react-hook-form';
import InputDropdown from './InputDropdown';

interface AmountSelectProps {
  name?: string;
  value?: number;
  label?: string;
  currency?: Currency;
  required?: boolean;
  onChange?: (value: number) => void;
  error?: FieldError;
  initialPackages?: number[]; // 👈 thêm prop này để truyền từ ngoài vào
  [key: string]: any;
}

const AmountSelect: React.FC<AmountSelectProps> = ({
  value,
  label,
  currency,
  required,
  onChange = () => {},
  error,
  initialPackages, // 👈 nhận từ props
}) => {
  // fallback: nếu không truyền vào thì dùng mặc định
  const amountPackages = useMemo(() => {
    return initialPackages?.length
      ? initialPackages
      : [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  }, [initialPackages]);

  return (
    <InputDropdown
      name="amount"
      label={label}
      placeholder="Please type or select amount!"
      value={value}
      onChange={onChange}
      initialPackages={amountPackages}
      required={required}
      currency={currency}
      error={error}
      id={uniqueId()}
    />
  );
};

export default AmountSelect;
