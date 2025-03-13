'use client';

import NestedBarChart, { BarItem } from '@/components/common/NestedBarChart';
import { fetchCategories } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useMemo } from 'react';

const ExpenseIncomeDashboard = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.expenseIncome);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const chartData: BarItem[] = useMemo(() => {
    if (!categories.data) return [];

    return categories.data.map((category) => {
      return {
        name: category.name,
        value: category.balance,
        color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
        type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        children: category.subCategories?.map((subCategory) => ({
          name: subCategory.name,
          value: subCategory.balance,
          color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
          type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        })),
      };
    });
  }, [categories]);

  if (categories.isLoading)
    return <div className="text-gray-800 dark:text-gray-200">Loading...</div>;
  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <NestedBarChart
      data={chartData}
      title="Monthly Budget Analysis"
      xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
    />
  );
};

export default ExpenseIncomeDashboard;
