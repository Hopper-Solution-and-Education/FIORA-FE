'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

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
import { useAppDispatch } from '@/store';
import { createProduct } from '../../slices/actions/createProductAsyncThunk';
import { getProductsAsyncThunk } from '../../slices/actions/getProductsAsyncThunk';
import ProductForm from '../molecules/ProductFieldForm';
import type { ProductFormValues } from '../schema/addProduct.schema';

const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
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

      await dispatch(createProduct(formattedData))
        .unwrap()
        .then(() => {
          setOpen(false);
          dispatch(getProductsAsyncThunk({ page: 1, pageSize: 10 }));
        });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus size={64} width={64} height={64} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[70%] h-[90%]">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new product or service.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-w-[100%]">
            <div className="m-2">
              <ProductForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
