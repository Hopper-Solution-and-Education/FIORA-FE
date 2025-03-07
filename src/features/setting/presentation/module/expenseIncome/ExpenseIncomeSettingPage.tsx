'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import LucieIcon from '@/features/setting/presentation/module/expenseIncome/molecules/LucieIcon';
import {
  setDeleteConfirmOpen,
  setDialogOpen,
  setSelectedCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import {
  Category,
  CategoryTypeEnum,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  // updateCategory,
} from '../../settingSlices/expenseIncomeSlides/actions';
import DeleteDialog from './molecules/DeleteDialog';
import InsertCategoryDialog from './molecules/InsertCategoryDialog';
import CategoryTable from './organisms/CategoryTable';

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

  const handleCreateCategory = (category: Partial<Category>) => {
    dispatch(
      createCategory({
        name: category.name || '',
        type: (category.type as CategoryTypeEnum) || CategoryTypeEnum.EXPENSE,
        subCategories: [],
      }),
    );
    dispatch(setDialogOpen(false));
    dispatch(setSelectedCategory(null));
  };

  const newCategory = {
    name: '',
    type: CategoryTypeEnum.EXPENSE,
    subCategories: [],
  };

  const handleDisplayDetailCategoryDialog = (category: Category) => {
    dispatch(setSelectedCategory(category));
    setDetailDialogOpen(true);
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
                      onClick={() => handleDisplayDetailCategoryDialog(category)}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(setDeleteConfirmOpen(true))}
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
                      onClick={() => handleDisplayDetailCategoryDialog(category)}
                    >
                      Adjust
                      <Icons.pencil className="ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(setDeleteConfirmOpen(true))}
                    >
                      <Icons.trash />
                    </Button>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>

      {/* ShadCN Dialog for displaying the category table */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent>
          <DialogTitle>Subcategories of {selectedCategory?.name}</DialogTitle>
          <DialogDescription>
            Below is a table of subcategories related to the selected category.
          </DialogDescription>

          <CategoryTable
            setSelectedCategory={(cat) => dispatch(setSelectedCategory(cat))}
            setDeleteConfirmOpen={(open) => dispatch(setDeleteConfirmOpen(open))}
            setDialogOpen={(open) => dispatch(setDialogOpen(open))}
          />

          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

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
