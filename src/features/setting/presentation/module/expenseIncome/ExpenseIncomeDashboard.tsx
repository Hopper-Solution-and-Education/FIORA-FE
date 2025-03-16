'use client';

import Loading from '@/components/common/Loading';
import NestedBarChart, { type BarItem } from '@/components/common/nested-bar-chart';
import { Button } from '@/components/ui/button';
import DeleteDialog from '@/features/setting/presentation/module/expenseIncome/molecules/DeleteDialog';
import InsertCategoryDialog from '@/features/setting/presentation/module/expenseIncome/molecules/InsertCategoryDialog';
import UpdateDialog from '@/features/setting/presentation/module/expenseIncome/molecules/UpdateDialog';
import {
  setDialogOpen,
  setSelectedCategory,
  setUpdateDialogOpen,
} from '@/features/setting/presentation/settingSlices/expenseIncomeSlides';
import { fetchCategories } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useMemo } from 'react';

const ExpenseIncomeDashboard = () => {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory } = useAppSelector((state) => state.expenseIncome);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // * CHART DATA ZONE *
  const chartData: BarItem[] = useMemo(() => {
    if (!categories.data) return [];

    return categories.data.map((category: Category) => {
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

  // * LOGIC ZONE *
  const handleDisplayDetailDialog = (item: any) => {
    const findCategory = findCategoryById(item.id, categories.data);
    if (findCategory) {
      dispatch(setSelectedCategory(findCategory));
      dispatch(setUpdateDialogOpen(true));
    }
  };

  const findCategoryById = (id: string, categories?: Category[]): Category | undefined => {
    if (!categories) return undefined;

    const categoryMatch = categories.find((category) => category.id == id);
    if (categoryMatch) return categoryMatch;

    for (const category of categories) {
      const subCategoryMatch = category.subCategories?.find((sub) => sub.id == id);
      if (subCategoryMatch) return subCategoryMatch;
    }

    return undefined;
  };

  if (categories.isLoading) return <Loading />;
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

      {/* Two-column layout on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expense Chart - Left side */}
        <NestedBarChart
          title="Expense"
          data={expenseData}
          xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          callback={handleDisplayDetailDialog}
        />

        {/* Income Chart - Right side */}
        <NestedBarChart
          title="Income"
          data={incomeData}
          xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          callback={handleDisplayDetailDialog}
        />
      </div>

      {/* DIALOG ZONE */}
      <UpdateDialog />

      <InsertCategoryDialog />

      <DeleteDialog />
    </div>
  );
};

export default ExpenseIncomeDashboard;
