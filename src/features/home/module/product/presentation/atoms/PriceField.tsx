'use client';

import type { Control, FieldErrors } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { ProductFormValues } from '../schema/addProduct.schema';
import { useState } from 'react';

interface PriceFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const PriceField = ({ control, errors }: PriceFieldProps) => {
  const [displayValue, setDisplayValue] = useState('');

  return (
    <FormField
      control={control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <Input
              className={cn({ 'border-red-500': errors.price })}
              type="text"
              placeholder="0 VND"
              value={displayValue}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ lại số
                setDisplayValue(rawValue); // Cập nhật giá trị hiển thị
                field.onChange(Number(rawValue)); // Cập nhật giá trị form
              }}
              onBlur={() => {
                // Format thành VND khi mất focus
                if (field.value) {
                  const formattedValue = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(field.value);
                  setDisplayValue(formattedValue);
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
