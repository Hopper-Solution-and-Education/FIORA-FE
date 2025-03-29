import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toast } from 'sonner';
import { setDeleteConfirmOpen, setSelectedCategory } from '@/features/home/module/category/slices';
import { useRouter } from 'next/navigation';
import { Category } from '@/features/home/module/category/slices/types';
import { deleteCategory } from '@/features/home/module/category/slices/actions';

export function useDeleteCategory() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, selectedCategory, deleteConfirmOpen } = useAppSelector(
    (state) => state.category,
  );

  const [newCategoryId, setNewCategoryId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset local state when dialog opens/closes
  useEffect(() => {
    if (deleteConfirmOpen) {
      setNewCategoryId('');
      setIsDeleting(false);
    }
  }, [deleteConfirmOpen]);

  // Check if the selected category has a balance
  const hasBalance = selectedCategory?.balance && selectedCategory.balance > 0;

  // Get available categories for transfer (excluding the selected one)
  const availableCategories = useMemo(() => {
    return categories.data?.filter((category) => category.id !== selectedCategory?.id) || [];
  }, [categories.data, selectedCategory?.id]);

  // Handle delete action
  const handleDeleteCategory = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      if (hasBalance && !newCategoryId) {
        toast.error('Please select a category to transfer transactions');
        return;
      }

      setIsDeleting(true);

      // Assuming deleteCategory accepts an optional newCategoryId for transfer
      await dispatch(deleteCategory({ id: selectedCategory.id, newCategoryId })).unwrap();

      toast.success('Category deleted successfully');
      dispatch(setDeleteConfirmOpen(false));
      dispatch(setSelectedCategory(null));
      router.push('/home/category');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  }, [dispatch, router, selectedCategory, hasBalance, newCategoryId]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    dispatch(setDeleteConfirmOpen(false));
  }, [dispatch]);

  // Open dialog with a specific category
  const openDeleteDialog = useCallback(
    (category: Category) => {
      dispatch(setSelectedCategory(category));
      dispatch(setDeleteConfirmOpen(true));
    },
    [dispatch],
  );

  return {
    deleteConfirmOpen,
    selectedCategory,
    newCategoryId,
    setNewCategoryId,
    isDeleting,
    hasBalance,
    availableCategories,
    handleDeleteCategory,
    handleClose,
    openDeleteDialog,
  };
}
