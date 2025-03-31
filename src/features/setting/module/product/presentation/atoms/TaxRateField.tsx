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
import { KeyboardEvent, useCallback } from 'react';
import { useFormContext, type Control } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';

interface TaxRateFieldProps {
  control: Control<ProductFormValues>;
}

const TaxRateField = ({ control }: TaxRateFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;
  const formatTaxRate = useCallback((value: number | null | undefined): string => {
    return value == null ? '' : `${parseFloat(value.toFixed(2))}`;
  }, []);

  const removeLeadingZeros = useCallback((value: string): string => {
    return value.replace(/^0+(?=[1-9]|\.)/, '') || '0';
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, field: { onChange: (value: any) => void }) => {
      let newValue = e.target.value.replace(/[^0-9.]/g, '').slice(0, 3);
      newValue = removeLeadingZeros(newValue);
      field.onChange(newValue ? parseFloat(newValue) : undefined);
    },
    [removeLeadingZeros],
  );

  const onKeyDownHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (
      isNaN(Number(e.key)) &&
      !['Backspace', 'Delete', '.', 'ArrowLeft', 'ArrowRight'].includes(e.key)
    ) {
      e.preventDefault();
    }
  }, []);

  const handleOnblur = useCallback((field: any) => {
    const parsedValue = parseFloat((field.value || 0).toFixed(2));
    field.onChange(parsedValue);
  }, []);

  return (
    <FormField
      control={control}
      name="taxRate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Tax Rate (%) <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              className={cn({ 'border-red-500': errors.taxRate })}
              type="text"
              inputMode="decimal"
              placeholder="0.00%"
              {...field}
              value={field.value != null ? formatTaxRate(field.value) : undefined}
              onChange={(e) => handleInputChange(e, field)}
              onBlur={() => handleOnblur(field)}
              onKeyDown={onKeyDownHandler}
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
