'use client';

import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LucieIcon from '@/features/setting/presentation/module/expenseIncome/molecules/LucieIcon';
import {
  setCategories,
  setDeleteConfirmOpen,
  setDialogOpen,
  setSelectedCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import {
  Category,
  CategoryTypeEnum,
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

  const [selectedMainCategory, setSelectedMainCategory] = useState<Category | null>(null);

  if (swrLoading || categories.isLoading) return <div>Loading...</div>;
  if (swrError) return <div>Error: {swrError.message}</div>;
  if (categories.error) return <div>Error: {categories.error}</div>;

  return (
    <section className="space-y-6 p-4">
      {/* INCOME SETTING */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Income Categories</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {categories.data?.map(
            (category: Category) =>
              category.type === CategoryTypeEnum.INCOME && (
                <Card
                  key={category.id}
                  className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-x-2 pb-3">
                    <LucieIcon iconName={category.icon} />
                    <CardTitle className="text-lg font-medium text-gray-800">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => dispatch(setSelectedCategory(category))}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedMainCategory(category)}
                    >
                      <Icons.eye />
                    </Button>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>

      {/* EXPENSE SETTING */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Expense Categories</h2>
        {/* Show List of Main Expense Categories */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {categories.data?.map(
            (category: Category) =>
              category.type === CategoryTypeEnum.EXPENSE && (
                <Card
                  key={category.id}
                  className="rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-x-2 pb-3">
                    <LucieIcon iconName={category.icon} />
                    <CardTitle className="text-lg font-medium text-gray-800">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => dispatch(setSelectedCategory(category))}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedMainCategory(category)}
                    >
                      <Icons.eye />
                    </Button>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>

      {/* Subcategory Table */}
      {selectedMainCategory && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Subcategories of {selectedMainCategory.name}
          </h3>
          <CategoryTable
            categories={categories.data || []}
            type={CategoryTypeEnum.EXPENSE}
            setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
            setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
            setDialogOpen={(open) => dispatch(setDialogOpen(open))}
            setSelectedMainCategory={(cat) => setSelectedMainCategory(cat)} // Pass this to handle subcategories
          />
        </div>
      )}

      <Button
        onClick={() => dispatch(setDialogOpen(true))}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
      >
        Add New Category
      </Button>

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
