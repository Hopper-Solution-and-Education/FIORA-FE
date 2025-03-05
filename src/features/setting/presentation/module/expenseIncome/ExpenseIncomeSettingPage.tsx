'use client';

import { useEffect } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Response } from '@/shared/types/Common.types';
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
  } = useCustomSWR<Response<Category[]>>('/api/categories/expense-income');

  // Sync SWR data with Redux
  useEffect(() => {
    if (swrData && !swrLoading && !swrError) {
      dispatch(setCategories(swrData));
    }
  }, [swrData, swrLoading, swrError, dispatch]);

  const handleCreateOrUpdateCategory = (category: Partial<Category>) => {
    if (selectedCategory) {
      dispatch(updateCategory({ ...selectedCategory, ...category })).then(() =>
        mutate('/api/categories/expenses-income'),
      );
    } else {
      dispatch(
        createCategory({
          name: category.name || '',
          type: (category.type as CategoryTypeEnum) || CategoryTypeEnum.EXPENSE,
          subCategories: [],
        }),
      ).then(() => mutate('/api/categories/expenses-income'));
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
      {/* I. EXPENSE SETTING */}
      {/* SHOW LIST OF MAIN EXPENSES CATEGORIES */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* TABLE SHOW CHILDRENT OF MAIN EXPENSES CATEGORIES */}

      {/* II. INCOME SETTING */}
      {/* SHOW LIST OF MAIN INCOME CATEGORIES */}

      {/* TABLE SHOW CHILDRENT OF MAIN INCOME CATEGORIES */}

      <Button onClick={() => dispatch(setDialogOpen(true))}>Add New Category</Button>
      {[CategoryTypeEnum.EXPENSE, CategoryTypeEnum.INCOME].map((type) => (
        <div key={type} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {type === CategoryTypeEnum.EXPENSE ? 'Expense Categories' : 'Income Categories'}
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
