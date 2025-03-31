'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { useEffect, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useFormContext, useWatch } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';

interface PriceFieldProps {
  control: Control<ProductFormValues>;
}

const PriceField = ({ control }: PriceFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;

  const [displayValue, setDisplayValue] = useState('');
  const priceValue = useWatch({
    control,
    name: 'price',
    defaultValue: 0,
  });

  // Hàm format giá trị thành VND
  const formatToVND = (value: number | undefined) => {
    if (value === undefined || value === null) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  useEffect(() => {
    const currentNumericValue = displayValue ? Number(displayValue.replace(/\D/g, '')) : 0;
    if (currentNumericValue !== priceValue) {
      setDisplayValue(formatToVND(priceValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceValue]);

  return (
    <FormField
      control={control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Price <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              className={cn({ 'border-red-500': errors.price })}
              type="text"
              placeholder="0 VND"
              value={displayValue}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
                setDisplayValue(rawValue);
                field.onChange(rawValue === '' ? undefined : Number(rawValue));
              }}
              onBlur={() => {
                // Format lại khi mất focus
                if (field.value !== undefined) {
                  setDisplayValue(formatToVND(field.value));
                } else {
                  setDisplayValue('');
                }
              }}
              onFocus={() => {
                setDisplayValue(field.value?.toString() || '');
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PriceField;
