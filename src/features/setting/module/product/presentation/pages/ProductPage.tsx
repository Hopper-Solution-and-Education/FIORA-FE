'use client';

import { ButtonCreation } from '@/components/common/atoms';
import { Separator } from '@/components/ui/separator';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { FIREBASE_GS_URL, FIREBASE_STORAGE_URL } from '@/shared/constants';
import { removeFromFirebase } from '@/shared/lib';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Product } from '../../domain/entities';
import { deleteProductAsyncThunk, getProductTransactionAsyncThunk } from '../../slices/actions';
import { DeleteProductDialog, ProductCatCreationDialog } from '../organisms';
import ChartPage from './CharPage';

const ProductPage = () => {
  const { page: pageTransaction, pageSize } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data } = useSession();

  useEffect(() => {
    // dispatch(getProductsAsyncThunk({ page: productPage, pageSize: productPageSize }));
    if (data?.user) {
      dispatch(
        getProductTransactionAsyncThunk({ page: pageTransaction, pageSize, userId: data?.user.id }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = async () => {
    if (!productToDelete?.id) return;

    const isFirebaseImage =
      productToDelete.icon &&
      (productToDelete.icon.startsWith(FIREBASE_STORAGE_URL) ||
        productToDelete.icon.startsWith(FIREBASE_GS_URL));

    if (isFirebaseImage) {
      await removeFromFirebase(productToDelete.icon);
    }

    dispatch(deleteProductAsyncThunk({ id: productToDelete.id }));
    setProductToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleClickButtonCreation = useCallback(() => {
    router.push('/setting/product/create');
  }, []);

  return (
    <div className="p-2">
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <DashboardHeading title="" description="" />
          <ButtonCreation
            className="mb-4"
            action={handleClickButtonCreation}
            toolTip="Create New Product"
          />
        </div>
        <Separator />
        <ChartPage />
      </div>

      <DeleteProductDialog
        product={productToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

      <ProductCatCreationDialog />
    </div>
  );
};

export default ProductPage;
