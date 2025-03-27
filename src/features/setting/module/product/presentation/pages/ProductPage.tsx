'use client';

import Loading from '@/components/common/Loading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { removeFromFirebase } from '@/features/setting/module/landing/landing/firebaseUtils';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product } from '../../domain/entities/Product';
import { deleteProductAsyncThunk } from '../../slices/actions/deleteProductAsyncThunk';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { getProductsAsyncThunk } from '../../slices/actions/getProductsAsyncThunk';
import { getProductTransactionAsyncThunk } from '../../slices/actions/getProductTransactionAsyncThunk';
import DeleteProductDialog from '../organisms/DeleteProductDialog';
import {
  defaultProductFormValue,
  ProductFormValues,
  productSchema,
} from '../schema/addProduct.schema';
import ChartPage from './CharPage';
import TablePage from './TablePage';

const ProductPage = () => {
  const { page, limit } = useAppSelector((state) => state.productManagement.categories);
  const { page: pageTransaction, pageSize } = useAppSelector(
    (state) => state.productManagement.productTransaction,
  );
  const { page: productPage, pageSize: productPageSize } = useAppSelector(
    (state) => state.productManagement.products,
  );
  const isDeletingProduct = useAppSelector((state) => state.productManagement.isDeletingProduct);

  const method = useForm<ProductFormValues>({
    resolver: yupResolver(productSchema),
    defaultValues: defaultProductFormValue,
  });

  const { reset } = method;
  const dispatch = useAppDispatch();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { data } = useSession();

  useEffect(() => {
    dispatch(fetchCategoriesProduct({ page, pageSize: limit }));
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
    <div>
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
            <ChartPage method={method} />
          </TabsContent>

          <TabsContent value="table">
            <TablePage reset={reset} setProductToDelete={setProductToDelete} />
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
