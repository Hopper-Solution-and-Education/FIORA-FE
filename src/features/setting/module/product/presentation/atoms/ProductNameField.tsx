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
import { useFormContext, type Control } from 'react-hook-form';
import { ProductFormValues } from '../schema';

interface ProductNameFieldProps {
  control: Control<ProductFormValues>;
}

const ProductNameField = ({ control }: ProductNameFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Name <span className="text-red-500">*</span>
          </FormLabel>
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
