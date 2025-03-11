'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LucieIcon from '@/features/setting/presentation/module/expenseIncome/molecules/LucieIcon';
import UpdateDialog from '@/features/setting/presentation/module/expenseIncome/molecules/UpdateDialog';
import {
  setDeleteConfirmOpen,
  setDialogOpen,
  setSelectedCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useState } from 'react';
import { deleteCategory, fetchCategories } from '../../settingSlices/expenseIncomeSlides/actions';
import DeleteDialog from './molecules/DeleteDialog';
import InsertCategoryDialog from './molecules/InsertCategoryDialog';

export default function ExpenseIncomeSettingPage() {
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, dialogOpen, deleteConfirmOpen } = useAppSelector(
    (state) => state.expenseIncome,
  );

  // Fetch categories on mount using Redux thunk
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSelectedCategory(categories.data?.[0] || null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(categories.data)]);

  const handleCreateCategory = (category: Partial<Category>) => {
    // dispatch(
    //   // createCategory({
    //   //   tax_rate: '',
    //   //   name: category.name || '',
    //   //   type: (category.type as CategoryType) || CategoryType.Expense,
    //   //   subCategories: [],
    //   //   icon: category.icon || '',
    //   // }),
    // );
    dispatch(setDialogOpen(false));
    dispatch(setSelectedCategory(null));
  };

  const handleDisplayDetailCategoryDialog = (category: Category) => {
    dispatch(setSelectedCategory(category));
    setDetailDialogOpen(true);
  };

  const handleDisplayDeleteConfirmDialog = (category: Category) => {
    dispatch(setSelectedCategory(category));
    dispatch(setDeleteConfirmOpen(true));
  };

  const handleDeleteCategory = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.id));
    }
    dispatch(setDeleteConfirmOpen(false));
  };

  if (categories.isLoading) return <div>Loading...</div>;
  if (categories.error) return <div>Error: {categories.error}</div>;

  return (
    <section className="space-y-6 p-4">
      {/* INCOME SETTING */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Income Categories</h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {categories.data?.map(
            (category: Category) =>
              category.type === CategoryType.Income && (
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
                      onClick={() => handleDisplayDetailCategoryDialog(category)}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDisplayDeleteConfirmDialog(category)}
                    >
                      <Icons.trash />
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
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {categories.data?.map(
            (category: Category) =>
              category.type === CategoryType.Expense && (
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
                      onClick={() => handleDisplayDetailCategoryDialog(category)}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDisplayDeleteConfirmDialog(category)}
                    >
                      <Icons.trash />
                    </Button>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>

      <UpdateDialog
        isDetailDialogOpen={isDetailDialogOpen}
        setDetailDialogOpen={setDetailDialogOpen}
      />

      <Button
        onClick={() => dispatch(setDialogOpen(true))}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
      >
        Add New Category
      </Button>

      <InsertCategoryDialog
        dialogOpen={dialogOpen}
        setDialogOpen={(open) => dispatch(setDialogOpen(open))}
        handleCreateCategory={handleCreateCategory}
      />

      <DeleteDialog
        deleteConfirmOpen={deleteConfirmOpen}
        setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
        handleDeleteCategory={handleDeleteCategory}
      />
    </section>
  );
}
