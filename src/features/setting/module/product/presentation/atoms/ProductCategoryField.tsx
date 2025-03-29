'use client';

import type React from 'react';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus } from 'lucide-react';
import { useState } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { ProductFormValues } from '../schema/addProduct.schema';

interface ProductCategoryFieldProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

const ProductCategoryField = ({ control, errors }: ProductCategoryFieldProps) => {
  const dispatch = useAppDispatch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
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
    setIsOpenDialog(true);
  };

  return (
    <>
      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Category <span className="text-red-500">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                <>
                  {categories.length === 0 ? (
                    <div>
                      <Button onClick={handleOpenDialog} title="Add Category">
                        <Plus />
                      </Button>
                    </div>
                  ) : (
                    categories.map((category) => {
                      const CategoryIcon =
                        Icons[category.icon as keyof typeof Icons] || Icons['product'];

                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex justify-between items-center gap-4">
                            <CategoryIcon size={18} />
                            <span className="text-sm">{category.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
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
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Category Creation</DialogTitle>
          </DialogHeader>
          <p>Product Category Creation.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCategoryField;
