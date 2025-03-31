import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import InputField from '@/components/common/atoms/InputField';
import { cn } from '@/shared/utils';

interface AvailableLimitDisplayProps {
  [key: string]: any;
}

const AvailableLimitDisplay: React.FC<AvailableLimitDisplayProps> = ({ ...props }) => {
  const { watch } = useFormContext();
  const type = watch('type');
  if (type !== ACCOUNT_TYPES.CREDIT_CARD) return null;
  const limit = Number(watch('limit')) || 0;
  const balance = Number(watch('balance')) || 0;
  const availableLimit = limit - balance;
  return (
    <InputField
      value={availableLimit.toFixed(2)}
      placeholder="0.00"
      label="Available Limit"
      readOnly
      className={cn('cursor-not-allowed', availableLimit < 0 && 'text-red-500')}
      {...props}
    />
  );
};

export default AvailableLimitDisplay;
