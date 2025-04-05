'use client';

import Loading from '@/components/common/atoms/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { removeFromFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { FIREBASE_GS_URL, FIREBASE_STORAGE_URL } from '@/shared/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '../../domain/entities/Product';
import { deleteProductAsyncThunk } from '../../slices/actions/deleteProductAsyncThunk';
import { getProductTransactionAsyncThunk } from '../../slices/actions/getProductTransactionAsyncThunk';
import DeleteProductDialog from '../organisms/DeleteProductDialog';
import ProductCatCreationDialog from '../organisms/ProductCatCreationDialog';
import ChartPage from './CharPage';

const ProductPage = () => {
  const { page: pageTransaction, pageSize } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );
  const isDeletingProduct = useAppSelector((state) => state.productManagement.isDeletingProduct);
  const isUpdatingCategoryProduct = useAppSelector(
    (state) => state.productManagement.isUpdatingProductCategory,
  );
  const isDeletingCategoryProduct = useAppSelector(
    (state) => state.productManagement.isDeletingProductCategory,
  );
  const isCreatingCategoryProduct = useAppSelector(
    (state) => state.productManagement.isCreatingProductCategory,
  );

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

  const handleNavigateToCreate = () => {
    redirect('/setting/product/create');
  };

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
      <>
        {(isDeletingProduct ||
          isCreatingCategoryProduct ||
          isUpdatingCategoryProduct ||
          isDeletingCategoryProduct) && <Loading />}
      </>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Products" description="Manage products" />
          <Button onClick={handleNavigateToCreate}>
            <Plus />
          </Button>
        </div>

        <Separator />
        <ChartPage />

        {/* <Tabs defaultValue="chart">
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
        </Tabs> */}
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
