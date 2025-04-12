'use client';

import Loading from '@/components/common/atoms/Loading';
import { Icons } from '@/components/Icon';
import { Separator } from '@/components/ui/separator';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { removeFromFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { FIREBASE_GS_URL, FIREBASE_STORAGE_URL } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Product } from '../../domain/entities';
import { deleteProductAsyncThunk, getProductTransactionAsyncThunk } from '../../slices/actions';
import { DeleteProductDialog, ProductCatCreationDialog } from '../organisms';
import ChartPage from './CharPage';

const ProductPage = () => {
  const { page: pageTransaction, pageSize } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );
  const isDeletingProduct = useAppSelector((state) => state.productManagement.isDeletingProduct);
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

  return (
    <div className="p-2">
      <>{isDeletingProduct && <Loading />}</>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Products" description="Manage products" />
          <Link href="/setting/product/create">
            <button className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white">
              <Icons.add className="h-6 w-6" />
            </button>
          </Link>
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
