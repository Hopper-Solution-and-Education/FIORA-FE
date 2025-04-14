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
import { memo, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { setIsOpenDialogAddCategory } from '../../slices';
import { ProductCategoryForm } from '../molecules';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
} from '../schema';

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
    defaultValues: defaultCategoryProductValue,
    mode: 'onChange',
  });

  const { reset } = methods;

  useEffect(() => {
    if (ProductCategoryFormState === 'edit' && productCategoryToEdit) {
      const editProduct = {
        id: productCategoryToEdit.id,
        name: productCategoryToEdit.name,
        icon: productCategoryToEdit.icon,
        description: productCategoryToEdit.description,
        tax_rate: parseFloat(productCategoryToEdit.taxRate?.toString() ?? '0'),
        createdAt: productCategoryToEdit.createdAt
          ? new Date(productCategoryToEdit.createdAt)
          : new Date(),
        updatedAt: productCategoryToEdit.updatedAt
          ? new Date(productCategoryToEdit.updatedAt)
          : new Date(),
      };
      reset(editProduct);
      console.log(editProduct);
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
