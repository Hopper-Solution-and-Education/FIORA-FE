'use client';

import Loading from '@/components/common/atoms/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { removeFromFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '../../domain/entities/Product';
import { deleteProductAsyncThunk } from '../../slices/actions/deleteProductAsyncThunk';
import { getProductsAsyncThunk } from '../../slices/actions/getProductsAsyncThunk';
import { getProductTransactionAsyncThunk } from '../../slices/actions/getProductTransactionAsyncThunk';
import DeleteProductDialog from '../organisms/DeleteProductDialog';
import ChartPage from './CharPage';
import TablePage from './TablePage';

const ProductPage = () => {
  const { page: pageTransaction, pageSize } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );
  const { page: productPage, pageSize: productPageSize } = useAppSelector(
    (state) => state.productManagement.products,
  );
  const isDeletingProduct = useAppSelector((state) => state.productManagement.isDeletingProduct);

  const dispatch = useAppDispatch();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data } = useSession();

  useEffect(() => {
    dispatch(getProductsAsyncThunk({ page: productPage, pageSize: productPageSize }));
    if (data?.user) {
      dispatch(
        getProductTransactionAsyncThunk({ page: pageTransaction, pageSize, userId: data?.user.id }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigateToCreate = () => {
    redirect('/setting/product/create');
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete?.id) return;

    const isFirebaseImage =
      productToDelete.icon &&
      (productToDelete.icon.startsWith('https://firebasestorage.googleapis.com') ||
        productToDelete.icon.startsWith('gs://'));

    if (isFirebaseImage) {
      console.log(productToDelete.icon);
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
          <Button onClick={handleNavigateToCreate}>
            <Plus />
          </Button>
        </div>

        <Separator />

        <Tabs defaultValue="chart">
          <TabsList className="my-2">
            <TabsTrigger value="chart">Product Chart</TabsTrigger>
            <TabsTrigger value="table">Product Table</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <ChartPage />
          </TabsContent>

          <TabsContent value="table">
            <TablePage setProductToDelete={handleDeleteProduct} />
          </TabsContent>
        </Tabs>
      </div>

      <DeleteProductDialog
        product={productToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductPage;
