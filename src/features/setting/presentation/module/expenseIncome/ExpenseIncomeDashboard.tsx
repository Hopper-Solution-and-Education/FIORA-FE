'use client';

import NestedBarChart, { BarItem } from '@/components/common/NestedBarChart';
import { fetchCategories } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
// import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useMemo } from 'react';

const COLORS = {
  Expense: '#EF4444', // Red for expenses
  Income: '#10B981', // Green for income
};

// Format currency function
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(Math.abs(value));
};

// Custom tooltip component with theme support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border rounded shadow-sm dark:border-gray-700">
        <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Type: <span className="font-bold">{payload[0].payload.type}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Balance: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
        </p>
        {payload[0].payload.parentId && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Parent: <span className="font-bold">{payload[0].payload.parentName}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

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
    // <GlobalVerticalChart
    //   data={chartData}
    //   title="Category Distribution"
    //   height={600}
    //   xAxisFormatter={formatCurrency}
    //   yAxisKey="name"
    //   valueKey="value"
    //   tooltipContent={CustomTooltip}
    //   legendItems={[
    //     { label: 'Expenses', color: COLORS.Expense },
    //     { label: 'Income', color: COLORS.Income },
    //   ]}
    // />
    <NestedBarChart
      data={chartData}
      title="Monthly Budget Analysis"
      height={500}
      xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
    />
  );
};

export default ExpenseIncomeDashboard;
