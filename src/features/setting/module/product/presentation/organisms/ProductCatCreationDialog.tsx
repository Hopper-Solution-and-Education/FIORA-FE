'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProductCategoryForm from '../molecules/ProductCategoryForm';

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductCatCreationDialog = ({ open, onOpenChange }: DeleteProductDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Product Category</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <ProductCategoryForm />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductCatCreationDialog;
