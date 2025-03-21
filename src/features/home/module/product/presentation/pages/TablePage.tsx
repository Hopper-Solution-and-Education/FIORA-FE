import { useAppDispatch, useAppSelector } from '@/store';
import React, { Dispatch, SetStateAction } from 'react';
import { UseFormReset } from 'react-hook-form';
import { Product } from '../../domain/entities/Product';
import { setDialogState, toggleDialogAddEdit } from '../../slices';
import ProductTable from '../organisms/ProductTable';

type TablePageProps = {
  reset: UseFormReset<any>;
  setProductToDelete: Dispatch<SetStateAction<Product | null>>;
  setDeleteDialogOpen: Dispatch<React.SetStateAction<boolean>>;
};

const TablePage = ({ reset, setDeleteDialogOpen, setProductToDelete }: TablePageProps) => {
  const {
    items: products,
    isLoading,
    total,
  } = useAppSelector((state) => state.productManagement.products);

  const dispatch = useAppDispatch();

  const handleEditProduct = (product: Product) => {
    dispatch(setDialogState('edit'));
    reset({
      id: product.id,
      icon: product.icon || '',
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? 0,
      taxRate: product.taxRate ?? 0,
      type: product.type ?? '',
      categoryId: product.categoryId || '',
      items: product.items || [],
    });
    dispatch(toggleDialogAddEdit(true));
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div>
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

          {/* Pagination */}
          {total > 0 && (
            <div className="flex justify-end text-sm text-muted-foreground">
              Showing {products?.length || 0} of {total} products
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TablePage;
