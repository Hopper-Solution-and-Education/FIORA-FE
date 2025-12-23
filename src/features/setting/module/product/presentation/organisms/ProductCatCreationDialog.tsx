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
import { memo, useCallback, useEffect } from 'react';
import { FormProvider, useForm, UseFormSetValue } from 'react-hook-form';
import { setIsOpenDialogAddCategory } from '../../slices';
import { ProductCategoryForm } from '../molecules';
import {
  CategoryProductFormValues,
  categoryProductsSchema,
  defaultCategoryProductValue,
  ProductFormValues,
} from '../schema';

type ProductCatCreationDialogType = {
  setValue?: UseFormSetValue<ProductFormValues>;
};

const ProductCatCreationDialog = ({ setValue }: ProductCatCreationDialogType) => {
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
    } else {
      reset(defaultCategoryProductValue);
    }
  }, [productCategoryToEdit]);

  const isOpenProductCateDialog = useAppSelector(
    (state) => state.productManagement.isOpenDialogAddCategory,
  );

  const handleCloseDialog = useCallback(() => {
    dispatch(setIsOpenDialogAddCategory(false));
    reset(defaultCategoryProductValue);
  }, []);

  return (
    <FormProvider {...methods}>
      <Dialog
        open={isOpenProductCateDialog}
        onOpenChange={() => {
          handleCloseDialog();
        }}
      >
        <DialogContent data-test="category-dialog">
          <DialogHeader>
            <DialogTitle>
              {ProductCategoryFormState === 'add'
                ? 'Add New Product Category'
                : `Update ${productCategoryToEdit?.name} - Product Category`}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide the name and any other relevant details for the new product category.
          </DialogDescription>
          <div>
            <ProductCategoryForm setValue={setValue} />
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default memo(ProductCatCreationDialog);
