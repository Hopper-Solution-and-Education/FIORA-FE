'use client';
import { Loading } from '@/components/common/atoms';
import FormPage from '@/components/common/forms/FormPage';
import CreateCategoryForm from '@/features/home/module/category/components/CreateCategoryForm';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';

export default function CreateCategory() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    if (!categories.data && !categories.isLoading) {
      dispatch(fetchCategories({ filters: {}, userId: '' }));
    }
  }, [categories.data, categories.isLoading, dispatch]);

  if (categories.isLoading) {
    return <Loading />;
  }

  return <FormPage title="Create New Category" FormComponent={CreateCategoryForm} />;
}
