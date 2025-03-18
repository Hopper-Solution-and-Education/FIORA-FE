'use client';

import PageContainer from '@/components/layouts/PageContainer';
import { Separator } from '@/components/ui/separator';
import { DashboardHeading } from '@/features/home/components/DashboardHeading';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Product } from '../../domain/entities/Product';
import { fetchCategoriesProduct } from '../../slices/actions/fetchCategoriesProduct';
import { getProductsAsyncThunk } from '../../slices/actions/getProductsAsyncThunk';
import AddProductDialog from '../organisms/AddProductDialog';
import DeleteProductDialog from '../organisms/DeleteProductDialog';
import ProductTable from '../organisms/ProductTable';

const ProductPage = () => {
  const { page, limit } = useAppSelector((state) => state.productManagement.categories);
  const {
    items: products,
    isLoading,
    total,
  } = useAppSelector((state) => state.productManagement.products);
  const dispatch = useAppDispatch();

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesProduct({ page: page, pageSize: limit }));
    dispatch(getProductsAsyncThunk({ page: 1, pageSize: 10 }));
  }, []);

  const handleEditProduct = (product: Product) => {
    // Implement edit functionality
    toast('Edit Product', {
      description: `Editing product: ${product.name}`,
    });
    // You would typically open a dialog or navigate to an edit page
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!productToDelete) return;

    // Here you would dispatch an action to delete the product
    // dispatch(deleteProductAsyncThunk(productToDelete.id));

    toast('Product Deleted', {
      description: `${productToDelete.name} has been deleted.`,
    });

    setProductToDelete(null);
    setDeleteDialogOpen(false);

    // Refresh the product list
    dispatch(getProductsAsyncThunk({ page: 1, pageSize: 10 }));
  };

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <DashboardHeading title="Products" description="Manage products" />
          <AddProductDialog />
        </div>

        <Separator />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading products...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <ProductTable
              products={products || []}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />

            {/* Pagination could be added here */}
            {total > 0 && (
              <div className="flex justify-end text-sm text-muted-foreground">
                Showing {products?.length || 0} of {total} products
              </div>
            )}
          </div>
        )}
      </div>

      <DeleteProductDialog
        product={productToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
};

export default ProductPage;
