'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { removeFromFirebase, uploadToFirebase } from '@/features/admin/landing/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { setDialogState, toggleDialogAddEdit } from '../../slices';
import { createProduct } from '../../slices/actions/createProductAsyncThunk';
import { updateProductAsyncThunk } from '../../slices/actions/updateProductAsyncThunk';
import { DialogStateType } from '../../slices/types';
import ProductForm from '../molecules/ProductFieldForm';
import { defaultProductFormValue, type ProductFormValues } from '../schema/addProduct.schema';

type AddProductDialogProps = {
  method: UseFormReturn<ProductFormValues>;
};

const AddProductDialog = ({ method }: AddProductDialogProps) => {
  const isOpenDialog = useAppSelector((state) => state.productManagement.isOpenDialogAddEdit);
  const isUpdatingProduct = useAppSelector((state) => state.productManagement.isUpdatingProduct);
  const isCreatingProduct = useAppSelector((state) => state.productManagement.isCreatingProduct);
  const dialogState = useAppSelector((state) => state.productManagement.dialogState);
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      let formattedData: ProductFormValues = {
        ...data,
        price: Number(data.price),
        taxRate: data.taxRate ? Number(data.taxRate) : null,
      };

      // Handle icon upload if it's a blob URL
      if (formattedData.icon && formattedData.icon.startsWith('blob:')) {
        if (formattedData.icon && !formattedData.icon.startsWith('blob:')) {
          await removeFromFirebase(formattedData.icon);
        }
        const response = await fetch(formattedData.icon);
        const blob = await response.blob();
        const fileName = formattedData.name.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
        const firebaseUrl = await uploadToFirebase({
          file: blob,
          path: 'images/product_icons',
          fileName,
        });
        formattedData = {
          ...formattedData,
          icon: firebaseUrl,
        };
      }

      if (dialogState === 'add') {
        await dispatch(createProduct(formattedData))
          .unwrap()
          .then(() => {
            handleToggleDialog(false, 'add');
          });
      } else if (dialogState === 'edit') {
        await dispatch(updateProductAsyncThunk(formattedData))
          .unwrap()
          .then(() => {
            handleToggleDialog(false, 'add');
          });
      }
    } catch (error) {
      console.error('Error creating/updating product:', error);
    }
  };

  const handleToggleDialog = useCallback(
    (value: boolean, type: DialogStateType) => {
      dispatch(toggleDialogAddEdit(value));
      if (value === false) {
        method.reset(defaultProductFormValue);
      }
      dispatch(setDialogState(type));
    },
    [dispatch, method],
  );

  return (
    <FormProvider {...method}>
      <Button onClick={() => handleToggleDialog(true, 'add')}>
        <Plus size={64} width={64} height={64} />
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={(value) => handleToggleDialog(value, 'add')}>
        <DialogContent className="sm:max-w-[70%] h-[90%]">
          <form onSubmit={method.handleSubmit(handleSubmit)} id="hook-form">
            <DialogHeader>
              <DialogTitle>
                {dialogState === 'add' ? 'Create New Product' : 'Edit Product'}
              </DialogTitle>
              <DialogDescription>
                {dialogState === 'add'
                  ? 'Fill in the details to create a new product or service.'
                  : 'Update the details of the product.'}
              </DialogDescription>
            </DialogHeader>

            <ProductForm method={method} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleToggleDialog(false, 'add')}
              >
                Cancel
              </Button>
              <Button
                disabled={isCreatingProduct || isUpdatingProduct}
                type="submit"
                form="hook-form"
              >
                {dialogState === 'add' ? (
                  <>{isCreatingProduct ? 'Creating...' : 'Create Product'}</>
                ) : (
                  <>{isUpdatingProduct ? 'Updating...' : 'Update Product'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default AddProductDialog;
