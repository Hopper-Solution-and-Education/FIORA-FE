import { useAppSelector } from '@/store';
import React, { Dispatch, SetStateAction } from 'react';
import { UseFormReset } from 'react-hook-form';
import { Product } from '../../domain/entities/Product';
import ProductTable from '../organisms/ProductTable';

type TablePageProps = {
  reset: UseFormReset<any>;
  setProductToDelete: Dispatch<SetStateAction<Product | null>>;
};

const TablePage = ({ setProductToDelete }: TablePageProps) => {
  const {
    items: products,
    isLoading,
    total,
  } = useAppSelector((state) => state.productManagement.products);

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
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
          <ProductTable onDelete={handleDeleteProduct} />

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
