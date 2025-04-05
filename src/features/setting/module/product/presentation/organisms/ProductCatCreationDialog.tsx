'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useLayoutEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { setIsOpenDialogAddCategory } from '../../slices';
import ProductCategoryForm from '../molecules/ProductCategoryForm';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
} from '../schema/productCategory.schema';

const ProductCatCreationDialog = () => {
  const dispatch = useAppDispatch();

  const productCategoryToEdit = useAppSelector(
    (state) => state.productManagement.ProductCategoryToEdit,
  );
  const ProductCategoryFormState = useAppSelector(
    (state) => state.productManagement.ProductCategoryFormState,
  );

  const methods = useForm<CategoryProductFormValues>({
    resolver: yupResolver(categoryProductsSchema),
    defaultValues:
      ProductCategoryFormState === 'add'
        ? defaultCategoryProductValue
        : ({
            id: productCategoryToEdit?.id,
            icon: productCategoryToEdit?.icon ?? 'dashboard',
            name: productCategoryToEdit?.name ?? '',
            description: productCategoryToEdit?.description ?? '',
            tax_rate: parseFloat(String(productCategoryToEdit?.taxRate)),
            createdAt: productCategoryToEdit?.createdAt,
            updatedAt: productCategoryToEdit?.updatedAt,
          } as CategoryProductFormValues),
  });

  const { reset } = methods;

  useLayoutEffect(() => {
    if (ProductCategoryFormState === 'edit' && productCategoryToEdit) {
      reset({
        id: productCategoryToEdit.id,
        name: productCategoryToEdit.name,
        icon: productCategoryToEdit.icon,
        description: productCategoryToEdit.description,
        tax_rate: productCategoryToEdit.taxRate ?? 0,
        createdAt: new Date(productCategoryToEdit.createdAt),
        updatedAt: new Date(productCategoryToEdit.updatedAt),
      });
    } else {
      reset(defaultCategoryProductValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCategoryToEdit]);

  const isOpenProductCateDialog = useAppSelector(
    (state) => state.productManagement.isOpenDialogAddCategory,
  );
  const handleChangeOpenDialog = (value: boolean) => {
    dispatch(setIsOpenDialogAddCategory(value));
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpenProductCateDialog} onOpenChange={handleChangeOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {ProductCategoryFormState === 'add'
                ? 'Add Product Category'
                : 'Update Product Category'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide the name and any other relevant details for the new product category.
          </DialogDescription>
          <div>
            <ProductCategoryForm />
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default memo(ProductCatCreationDialog);
