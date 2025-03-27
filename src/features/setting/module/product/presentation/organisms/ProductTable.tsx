'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Product } from '../../domain/entities/Product';
import { getProductsAsyncThunk } from '../../slices/actions/getProductsAsyncThunk';

interface ProductTableProps {
  onDelete: (product: Product) => void;
}

const ProductTable = ({ onDelete }: ProductTableProps) => {
  const dispatch = useAppDispatch();
  const {
    items: products,
    page,
    isLoading,
    pageSize,
    hasMore,
  } = useAppSelector((state) => state.productManagement.products);

  const handleNextPage = () => {
    if (!isLoading && hasMore) {
      dispatch(getProductsAsyncThunk({ page: page + 1, pageSize }));
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      dispatch(getProductsAsyncThunk({ page: page - 1, pageSize }));
    }
  };

  const handleEdit = (product: Product) => {
    redirect(`/setting/product/update/${product.id}`);
  };

  return (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Tax Rate</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    {product.icon ? (
                      <AvatarImage src={product.icon} alt={product.name} />
                    ) : (
                      <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(product.price)}
                </TableCell>
                <TableCell>{product.taxRate ? `${product.taxRate}%` : 'N/A'}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(product)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center p-4">
        <Button variant="outline" onClick={handlePreviousPage} disabled={!hasMore || isLoading}>
          Previous
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" onClick={handleNextPage} disabled={!hasMore || isLoading}>
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductTable;
