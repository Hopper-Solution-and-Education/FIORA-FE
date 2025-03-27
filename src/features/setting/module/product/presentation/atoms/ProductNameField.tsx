'use client';

import type { Control, FieldErrors } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductFormValues } from '../schema/addProduct.schema';
import { cn } from '@/shared/utils';

interface ProductNameFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ProductNameField = ({ control, errors }: ProductNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              className={cn({ 'border-red-500': errors.name })}
              placeholder="Product name"
              {...field}
            />
          </FormControl>
          <FormDescription>Maximum 50 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductNameField;
