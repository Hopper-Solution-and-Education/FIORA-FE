'use client';

import { useEffect } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import {
  setDialogOpen,
  setDeleteConfirmOpen,
  setSelectedCategory,
  setCategories,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import {
  CategoryTypeEnum,
  Category,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useCustomSWR } from '@/lib/swrConfig';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '../../settingSlices/expenseIncomeSlides/actions';
import DeleteDialog from './molecules/DeleteDialog';
import MergeDialog from './molecules/MergeDialog';
import CategoryTable from './organisms/CategoryTable';

export default function ExpenseIncomeSettingPage() {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, dialogOpen, deleteConfirmOpen } = useAppSelector(
    (state) => state.expenseIncome,
  );

  // Fetch categories with SWR
  const {
    data: swrData,
    error: swrError,
    isLoading: swrLoading,
  } = useCustomSWR<Category[]>('/categories');

  // Sync SWR data with Redux
  useEffect(() => {
    if (swrData && !swrLoading && !swrError) {
      dispatch(setCategories(swrData));
    }
  }, [swrData, swrLoading, swrError, dispatch]);

  const handleCreateOrUpdateCategory = (category: Partial<Category>) => {
    if (selectedCategory) {
      dispatch(updateCategory({ ...selectedCategory, ...category })).then(() =>
        mutate('/categories'),
      );
    } else {
      dispatch(
        createCategory({
          name: category.name || '',
          type: (category.type as CategoryTypeEnum) || CategoryTypeEnum.EXPENSE,
          subCategories: [],
        }),
      ).then(() => mutate('/categories'));
    }
    dispatch(setDialogOpen(false));
    dispatch(setSelectedCategory(null));
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.id));
    }
    dispatch(setDeleteConfirmOpen(false));
  };

  const newCategory = {
    name: '',
    type: CategoryTypeEnum.EXPENSE,
    subCategories: [],
  };

  if (swrLoading || categories.isLoading) return <div>Loading...</div>;
  if (swrError) return <div>Error: {swrError.message}</div>;
  if (categories.error) return <div>Error: {categories.error}</div>;

  return (
    <section>
      <Button onClick={() => dispatch(setDialogOpen(true))}>Add New Category</Button>
      {['EXPENSE', 'INCOME'].map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {type === 'EXPENSE' ? 'Expense Categories' : 'Income Categories'}
          </h2>
          <CategoryTable
            categories={categories.data || []}
            type={type}
            setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
            setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
            setDialogOpen={(open) => dispatch(setDialogOpen(open))}
          />
        </div>
      ))}

      <MergeDialog
        dialogOpen={dialogOpen}
        setDialogOpen={(open) => dispatch(setDialogOpen(open))}
        selectedCategory={selectedCategory || undefined}
        setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
        newCategory={newCategory}
        setNewCategory={() => {}} // Handled in Redux
        handleCreateOrUpdateCategory={handleCreateOrUpdateCategory}
      />

      <DeleteDialog
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
        handleDeleteCategory={handleDeleteCategory}
      />
    </section>
  );
}
