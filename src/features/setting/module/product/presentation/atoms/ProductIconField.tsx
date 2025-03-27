'use client';

import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import type { Control } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';
import IconUploader from './IconUploader';

interface ProductIconFieldProps {
  control: Control<ProductFormValues>;
}

const ProductIconField = ({ control }: ProductIconFieldProps) => {
  return (
    <FormField
      control={control}
      name="icon"
      render={() => (
        <FormItem className="col-span-2">
          <IconUploader fieldPath="icon" label="Product Icon" maxSize={2 * 1024 * 1024} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductIconField;
