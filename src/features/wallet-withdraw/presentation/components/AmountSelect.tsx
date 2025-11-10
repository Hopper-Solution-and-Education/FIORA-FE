import AmountInputDropdown from '@/components/common/forms/input/AmountInputDropdown';
import { useAppSelector } from '@/store';
import { Currency } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { OptionDropdown } from '../../types';

interface AmountSelectProps {
  name?: string;
  value?: number;
  label?: string;
  currency?: Currency;
  required?: boolean;
  onChange?: (value: number) => void;
  error?: FieldError;
  [key: string]: any;
}

const AmountSelect: React.FC<AmountSelectProps> = ({
  value,
  label,
  currency,
  required,
  onChange = () => {},
  error,
  ...props
}) => {
  const packageFX = useAppSelector((state) => state.wallet.packageFX);
  const [amounts, setAmounts] = useState<OptionDropdown[]>([]);

  useEffect(() => {
    if (packageFX && packageFX?.length > 0) {
      const sortedPackageFX = [...packageFX].sort(
        (a, b) => Number(a?.fxAmount) - Number(b?.fxAmount),
      );

      const matchPackage2OptionType = sortedPackageFX.map((pkg) => ({
        value: pkg.fxAmount.toString(),
        label: pkg.fxAmount.toString(),
      })) as OptionDropdown[];

      setAmounts([...matchPackage2OptionType]);
    }
  }, [packageFX]);

  return (
    <AmountInputDropdown
      {...({
        value,
        label,
        required,
        options: amounts,
        currency,
        placeholder: 'Please type or select amount!',
        onChange,
        error,
        classContainer: props?.className,
        ...props,
      } as any)}
    />
  );
};

export default AmountSelect;
