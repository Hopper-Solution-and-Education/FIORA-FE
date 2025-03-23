'use client';

import type React from 'react';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import type { Control, FieldErrors } from 'react-hook-form';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { ProductFormValues } from '../schema/addProduct.schema';

interface ProductCategoryFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ProductCategoryField = ({ control, errors }: ProductCategoryFieldProps) => {
  const dispatch = useAppDispatch();
  const {
    data: categories,
    isLoading,
    hasMore,
    page,
    limit,
  } = useAppSelector((state) => state.productManagement.categories);

  const loadMoreCategories = () => {
    if (hasMore && !isLoading) {
      dispatch(fetchCategoriesProduct({ page: page, pageSize: limit }));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPosition = target.scrollHeight - target.scrollTop - target.clientHeight;

    // Define a threshold (e.g., 10 pixels) to consider it the "last item"
    const scrollThreshold = 20;

    if (scrollPosition <= scrollThreshold) {
      loadMoreCategories();
    }
  };

  return (
    <FormField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn({
                  'border-red-500': errors.categoryId,
                })}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              className="max-h-[200px]"
              onScrollCapture={handleScroll}
              position="popper"
              sideOffset={4}
            >
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="ml-2 text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductCategoryField;
