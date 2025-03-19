'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { removeFromFirebase, uploadToFirebase } from '@/features/admin/landing/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { UseFormReturn } from 'react-hook-form';
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
          path: 'images/product_icons', // Choose an appropriate path
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
      console.error('Error creating product:', error);
    }
  };

  const handleToggleDialog = (value: boolean, type: DialogStateType) => {
    dispatch(toggleDialogAddEdit(value));
    if (value === false) {
      method.reset(defaultProductFormValue);
    }
    dispatch(setDialogState(type));
  };

  return (
    <>
      <Button onClick={() => handleToggleDialog(true, 'add')}>
        <Plus size={64} width={64} height={64} />
      </Button>
      <Dialog open={isOpenDialog} onOpenChange={(value) => handleToggleDialog(value, 'add')}>
        <DialogContent className="sm:max-w-[70%] h-[90%]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new product or service.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-w-[100%]">
            <div className="m-2">
              <ProductForm
                method={method}
                onSubmit={handleSubmit}
                onCancel={() => handleToggleDialog(false, 'add')}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
