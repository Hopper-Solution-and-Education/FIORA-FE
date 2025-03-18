'use client';

import Loading from '@/components/common/Loading';
import NestedBarChart, { type BarItem } from '@/components/common/nested-bar-chart';
import { Icons } from '@/components/Icon';
import DeleteDialog from '@/features/home/module/category/components/DeleteDialog';
import InsertCategoryDialog from '@/features/home/module/category/components/InsertCategoryDialog';
import UpdateDialog from '@/features/home/module/category/components/UpdateDialog';
import {
  setDialogOpen,
  setSelectedCategory,
  setUpdateDialogOpen,
} from '@/features/home/module/category/slices';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useMemo } from 'react';

const CategoryDashboard = () => {
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { categories, selectedCategory } = useAppSelector((state) => state.category);

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
        color:
          category.type === CategoryType.Expense
            ? COLORS.DEPS_DANGER.LEVEL_1
            : COLORS.DEPS_SUCCESS.LEVEL_1,
        type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        children: category.subCategories?.map((subCategory) => ({
          id: subCategory.id,
          name: subCategory.name,
          value: subCategory.balance || 0,
          color:
            category.type === CategoryType.Expense
              ? COLORS.DEPS_DANGER.LEVEL_1
              : COLORS.DEPS_SUCCESS.LEVEL_1,
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
    <div className="p-4 md:px-6">
      <div className="flex justify-end">
        <button
          onClick={() => dispatch(setDialogOpen(true))}
          className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white"
        >
          <Icons.add className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NestedBarChart
          title="Expense"
          data={expenseData}
          xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          callback={handleDisplayDetailDialog}
          levelConfig={{
            totalName: 'Total Spent',
            colors: {
              0: '#e30613',
              1: '#fa4c58',
              2: '#fc9ca2',
            },
          }}
        />

        <NestedBarChart
          title="Income"
          data={incomeData}
          xAxisFormatter={(value) => `${(value / 1000000).toFixed(1)}M ₫`}
          callback={handleDisplayDetailDialog}
          levelConfig={{
            totalName: 'Total Income',
            colors: {
              0: '#57cc99',
              1: '#80ed99',
              2: '#c7f9cc',
            },
          }}
        />
      </div>

      {/* DIALOG ZONE */}
      <UpdateDialog />

      <InsertCategoryDialog />

      <DeleteDialog />
    </div>
  );
};

export default CategoryDashboard;
