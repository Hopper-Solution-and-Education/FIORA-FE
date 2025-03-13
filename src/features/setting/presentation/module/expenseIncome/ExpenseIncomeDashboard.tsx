'use client';

import { useEffect, useMemo, useState } from 'react';
import { CategoryType } from '@prisma/client';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCategories } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { COLORS } from '@/shared/constants/chart';
import NestedBarChart, { type BarItem } from '@/components/common/NestedBarChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ExpenseIncomeDashboard = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.expenseIncome);
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.Expense);

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

  const expenseData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Expense);
  }, [chartData]);

  const incomeData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Income);
  }, [chartData]);

  if (categories.isLoading)
    return <div className="text-gray-800 dark:text-gray-200">Loading...</div>;
  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <div className="space-y-4">
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
            title="Monthly Expense Analysis"
            xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          />
        </TabsContent>
        <TabsContent value={CategoryType.Income}>
          <NestedBarChart
            data={incomeData}
            title="Monthly Income Analysis"
            xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseIncomeDashboard;
