'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/shared/utils';
import type { Control, FieldErrors } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';

interface ProductDescriptionFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ProductDescriptionField = ({ control, errors }: ProductDescriptionFieldProps) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              className={`resize-none ${cn({ 'border-red-500': errors.description })}`}
              placeholder="Product description"
              {...field}
            />
          </FormControl>
          <FormDescription>Maximum 1000 characters</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductDescriptionField;
