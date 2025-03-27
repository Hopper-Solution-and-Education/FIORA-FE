'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/store';
import { toast } from 'sonner';
import { deleteCategory } from '@/features/home/module/category/slices/actions';
import { setDeleteConfirmOpen, setSelectedCategory } from '@/features/home/module/category/slices';
import { useRouter } from 'next/navigation';

const DeleteDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, selectedCategory, deleteConfirmOpen } = useAppSelector(
    (state) => state.category,
  );

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await dispatch(deleteCategory(selectedCategory.id)).unwrap();
        toast.success('Category deleted successfully');
        dispatch(setDeleteConfirmOpen(false));
        dispatch(setSelectedCategory(null));
        router.push('/home/category');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <Dialog open={deleteConfirmOpen} onOpenChange={(open) => dispatch(setDeleteConfirmOpen(open))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete {selectedCategory?.name} category?</p>
        <DialogFooter>
          <Button onClick={() => dispatch(setDeleteConfirmOpen(false))}>No</Button>
          <Button
            variant="destructive"
            onClick={handleDeleteCategory}
            disabled={!selectedCategory || categories.isLoading}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
