'use client';

import type { Control, FieldErrors } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { ProductFormValues } from '../schema/addProduct.schema';

interface PriceFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const PriceField = ({ control, errors }: PriceFieldProps) => {
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
              type="number"
              step="0.01"
              placeholder="0.00"
              {...field}
              onKeyDown={(e) => {
                if (
                  isNaN(Number(e.key)) &&
                  e.key !== 'Backspace' &&
                  e.key !== 'Delete' &&
                  e.key !== '.' &&
                  e.key !== 'ArrowLeft' &&
                  e.key !== 'ArrowRight'
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                if (isNaN(Number(e.target.value)) && e.target.value !== '') {
                  e.target.value = '';
                  field.onChange(undefined);
                } else {
                  field.onChange(Number(e.target.value));
                }
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
