import { useAppSelector } from '@/store';
import { Product } from '../../domain/entities/Product';
import ProductTable from '../organisms/ProductTable';

type TablePageProps = {
  setProductToDelete: (product: Product) => void;
};

const TablePage = ({ setProductToDelete }: TablePageProps) => {
  const {
    items: products,
    isLoading,
    total,
  } = useAppSelector((state) => state.productManagement.products);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading products...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <ProductTable onDelete={setProductToDelete} />

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
