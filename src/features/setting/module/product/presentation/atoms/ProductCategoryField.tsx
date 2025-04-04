'use client';

import type React from 'react';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ICON_SIZE } from '@/shared/constants/size';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { Plus } from 'lucide-react';
import { useFormContext, type Control } from 'react-hook-form';
import {
  setIsOpenDialogAddCategory,
  setProductCategoryFormState,
  setProductCategoryToEdit,
} from '../../slices';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { ProductFormValues } from '../schema/addProduct.schema';

interface ProductCategoryFieldProps {
  control: Control<ProductFormValues>;
}

const ProductCategoryField = ({ control }: ProductCategoryFieldProps) => {
  const method = useFormContext<ProductFormValues>();

  const {
    formState: { errors },
  } = method;

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

  const handleOpenDialog = () => {
    dispatch(setIsOpenDialogAddCategory(true));
    dispatch(setProductCategoryFormState('add'));
    dispatch(setProductCategoryToEdit(null));
  };

  return (
    <>
      <FormField
        control={control}
        name="catId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <FormControl>
                <SelectTrigger
                  className={cn({
                    'border-red-500': errors.catId,
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
                <>
                  {categories.map((category) => {
                    const CategoryIcon =
                      Icons[category.icon as keyof typeof Icons] || Icons['product'];

                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex justify-between items-center gap-4">
                          <CategoryIcon size={ICON_SIZE.MD} />
                          <span className="text-sm">{category.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                  <Button onClick={handleOpenDialog} className="w-full mx-auto">
                    <Plus className="w-4 h-4" />
                  </Button>
                </>

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
    </>
  );
};

export default ProductCategoryField;
