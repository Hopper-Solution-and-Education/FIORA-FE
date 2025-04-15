'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { cn } from '@/shared/utils';
import InputCurrency from '@/components/common/forms/input/InputCurrency';

interface AvailableLimitDisplayProps {
  name: string;
  value?: number;
  error?: FieldError;
  [key: string]: any;
}

const AvailableLimitDisplay: React.FC<AvailableLimitDisplayProps> = ({
  name,
  value = 0,
  error,
  ...props
}) => {
  const [displayError, setDisplayError] = useState<FieldError | undefined>(undefined);
  const { watch, setValue, trigger } = useFormContext();
  const type = watch('type');
  const currency = watch('currency');
  const balance = watch('balance');
  const limit = watch('limit');

  useEffect(() => {
    if (type === ACCOUNT_TYPES.CREDIT_CARD) {
      if (balance !== undefined && limit !== undefined) {
        setValue('availableLimit', limit + balance);
        trigger('availableLimit');
      } else {
        setValue('availableLimit', 0);
        trigger('availableLimit');
      }
    }
  }, [balance, limit, type, setValue, trigger]);

  useEffect(() => {
    if (error) {
      setDisplayError({
        type: 'validate',
        message: 'Available limit for credit card must be >= 0',
      });
    } else {
      setDisplayError(undefined);
    }
  }, [error]);

  if (type !== ACCOUNT_TYPES.CREDIT_CARD) return null;

  return (
    <div>
      <InputCurrency
        label="Available Limit"
        name={name}
        value={value}
        placeholder="0.00"
        currency={currency}
        className={cn('cursor-not-allowed', 'text-red-500')}
        error={displayError}
        readOnly
        onChange={() => {}}
        {...props}
      />
    </div>
  );
};

export default AvailableLimitDisplay;
