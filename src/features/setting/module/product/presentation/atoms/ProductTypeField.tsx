'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { ProductType } from '@prisma/client';
import { Control, useFormContext } from 'react-hook-form';
import { ProductFormValues } from '../schema/addProduct.schema';

interface ProductTypeFieldProps {
  control: Control<ProductFormValues>;
}

const ProductTypeField = ({ control }: ProductTypeFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>
              Type <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={cn({ 'border-red-500': errors.type })}>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={ProductType.Product}>Product</SelectItem>
                <SelectItem value={ProductType.Service}>Service</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ProductTypeField;
