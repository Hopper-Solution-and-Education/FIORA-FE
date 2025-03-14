'use client';

import { useEffect, useMemo, useState } from 'react';
import { CategoryType } from '@prisma/client';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  createCategory,
  // createCategory,
  deleteCategory,
  fetchCategories,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { COLORS } from '@/shared/constants/chart';
import NestedBarChart, { type BarItem } from '@/components/common/nested-bar-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  setDeleteConfirmOpen,
  setDialogOpen,
  setSelectedCategory,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import UpdateDialog from '@/features/setting/presentation/module/expenseIncome/molecules/UpdateDialog';
import InsertCategoryDialog from '@/features/setting/presentation/module/expenseIncome/molecules/InsertCategoryDialog';
import DeleteDialog from '@/features/setting/presentation/module/expenseIncome/molecules/DeleteDialog';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { NewCategoryDefaultValues } from '../../settingSlices/expenseIncomeSlides/utils/formSchema';

const ExpenseIncomeDashboard = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, dialogOpen, deleteConfirmOpen, updateDialogOpen } =
    useAppSelector((state) => state.expenseIncome);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.Expense);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const chartData: BarItem[] = useMemo(() => {
    if (!categories.data) return [];

    return categories.data.map((category) => {
      return {
        id: category.id,
        name: category.name,
        value: category.balance || 0,
        color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
        type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        children: category.subCategories?.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          value: subCategory.balance || 0,
          color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
          type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        })),
      };
    });
  }, [categories]);

  const expenseData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Expense);
  }, [chartData]);

  const incomeData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Income);
  }, [chartData]);

  // LOGIC ZONE
  const handleCreateCategory = (category: NewCategoryDefaultValues) => {
    dispatch(createCategory(category));
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

  if (categories.isLoading)
    return <div className="text-gray-800 dark:text-gray-200">Loading...</div>;
  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <div className="space-y-4">
      <Button
        onClick={() => dispatch(setDialogOpen(true))}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700"
      >
        Add New Category
      </Button>

      <Tabs
        defaultValue={CategoryType.Expense}
        onValueChange={(value) => setActiveTab(value as CategoryType)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={CategoryType.Expense}>Expense</TabsTrigger>
          <TabsTrigger value={CategoryType.Income}>Income</TabsTrigger>
        </TabsList>
        <TabsContent value={CategoryType.Expense}>
          <NestedBarChart
            data={expenseData}
            xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          />
        </TabsContent>
        <TabsContent value={CategoryType.Income}>
          <NestedBarChart
            data={incomeData}
            xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          />
        </TabsContent>
      </Tabs>

      {/* DIALOG ZONE */}
      <UpdateDialog isDetailDialogOpen={updateDialogOpen} />

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
    </div>
  );
};

export default ExpenseIncomeDashboard;
