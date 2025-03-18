'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/shared/utils';
import { useCallback } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';

interface TaxRateFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const TaxRateField = ({ control, errors }: TaxRateFieldProps) => {
  const formatTaxRate = useCallback((value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return '';
    }
    return parseFloat(value.toFixed(2)).toString();
  }, []);

  const removeLeadingZeros = useCallback((value: string): string => {
    if (!value) {
      return '';
    }
    return value.replace(/^0+(?=[1-9]|\.)/, '');
  }, []);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      field: { onChange: (value: any) => void; value: any },
    ) => {
      let newValue = e.target.value;
      if (newValue.length > 3) {
        newValue = newValue.slice(0, 3); // Truncate to 3 characters
      }
      newValue = removeLeadingZeros(newValue);
      field.onChange(newValue === '' ? undefined : parseFloat(newValue));
    },
    [removeLeadingZeros],
  );

  return (
    <FormField
      control={control}
      name="taxRate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tax Rate (%)</FormLabel>
          <FormControl>
            <Input
              className={cn({ 'border-red-500': errors.taxRate })}
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
              value={field.value === null ? '' : field.value}
              onChange={(e) => handleInputChange(e, field)}
              onBlur={() => {
                field.onChange(parseFloat((field.value || 0).toFixed(2)));
              }}
            />
          </FormControl>
          <FormDescription>Optional tax rate percentage</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TaxRateField;
