'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import ProductCategoryForm from '../molecules/ProductCategoryForm';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
} from '../schema/productCategory.schema';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductCatCreationDialog = ({ open, onOpenChange }: DeleteProductDialogProps) => {
  const methods = useForm<CategoryProductFormValues>({
    resolver: yupResolver(categoryProductsSchema),
    defaultValues: defaultCategoryProductValue,
  });

  return (
    <FormProvider {...methods}>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Product Category</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <ProductCategoryForm />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </FormProvider>
  );
};

export default ProductCatCreationDialog;
