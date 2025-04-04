import { setDeleteConfirmOpen, setSelectedCategory } from '@/features/home/module/category/slices';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { findCategoryById } from '@/features/home/module/category/slices/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

export function useUpdateCategory(id: string) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (!categories.data && !categories.isLoading) {
      dispatch(fetchCategories());
    }
  }, [categories.data, categories.isLoading, dispatch]);

  const category = useMemo(() => {
    if (!categories.data) {
      return null;
    }
    return findCategoryById(categories.data, id);
  }, [categories.data, id]);

  const handleDelete = useCallback(() => {
    if (category && category.subCategories.length > 0) {
      toast.error('Please delete the subcategories first!');
      return;
    }

    if (category) {
      dispatch(setSelectedCategory(category));
      dispatch(setDeleteConfirmOpen(true));
    }
  }, [category, dispatch]);

  return {
    category,
    isLoading: categories.isLoading,
    error: categories.error,
    handleDelete,
  };
}
