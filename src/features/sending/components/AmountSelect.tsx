import AmountIntputDropDown from '@/components/common/forms/input/AmountInputDropdown';
import { DEFAULT_AMOUNT_PACKAGES } from '@/shared/constants';
import { Currency } from '@prisma/client';
import { uniqueId } from 'lodash';
import React, { useMemo } from 'react';
import { FieldError } from 'react-hook-form';

interface AmountSelectProps {
  name?: string;
  value?: number;
  label?: string;
  currency?: Currency | string;
  required?: boolean;
  onChange?: (value: number) => void;
  error?: FieldError;
  initialPackages?: number[];
  [key: string]: any;
}

const AmountSelect: React.FC<AmountSelectProps> = ({
  value,
  label,
  currency,
  required,
  onChange = () => {},
  error,
  initialPackages,
}) => {
  const amountPackages = useMemo(() => {
    return initialPackages?.length ? initialPackages : DEFAULT_AMOUNT_PACKAGES;
  }, [initialPackages]);

  return (
    <AmountIntputDropDown
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
