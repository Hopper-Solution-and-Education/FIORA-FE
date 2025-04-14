'use client';
import NestedBarChart, { type BarItem } from '@/components/common/nested-bar-chart';
import { Icons } from '@/components/Icon';
import { formatCurrency } from '@/shared/lib/formatCurrency';
import DeleteDialog from '@/features/home/module/category/components/DeleteDialog';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';

const CategoryDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.category);

  // * INITIALIZATION CHART DATA ZONE
  const chartData: BarItem[] = useMemo(() => {
    if (!categories.data) return [];
    return categories.data.map((category: Category) => ({
      id: category.id,
      name: category.name,
      value: category.balance || 0,
      icon: category.icon,
      color:
        category.type === CategoryType.Expense
          ? COLORS.DEPS_DANGER.LEVEL_1
          : COLORS.DEPS_SUCCESS.LEVEL_1,
      type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
      children: category.subCategories?.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        value: subCategory.balance || 0,
        icon: subCategory.icon,
        color:
          category.type === CategoryType.Expense
            ? COLORS.DEPS_DANGER.LEVEL_1
            : COLORS.DEPS_SUCCESS.LEVEL_1,
        type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
      })),
    }));
  }, [categories]);

  const expenseData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Expense);
  }, [chartData]);

  const incomeData = useMemo(() => {
    return chartData.filter((item) => item.type === CategoryType.Income);
  }, [chartData]);

  // * HANDLERS FUNCTIONS ZONE
  const handleDisplayDetail = (item: any) => {
    if (item.id) {
      router.push(`/category/update/${item.id}`);
    }
  };

  // * USE EFFECT ZONE
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <div className="p-4 md:px-6">
      <div className="flex justify-end">
        <Link href="/category/create">
          <button className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white">
            <Icons.add className="h-6 w-6" />
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <NestedBarChart
              title="Expense"
              data={expenseData}
              xAxisFormatter={(value) => formatCurrency(value)}
              callback={handleDisplayDetail}
              levelConfig={{
                totalName: 'Total Spent',
                colors: {
                  0: COLORS.DEPS_DANGER.LEVEL_1,
                  1: COLORS.DEPS_DANGER.LEVEL_3,
                  2: COLORS.DEPS_DANGER.LEVEL_5,
                },
              }}
            />
            <NestedBarChart
              title="Income"
              data={incomeData}
              xAxisFormatter={(value) => formatCurrency(value)}
              callback={handleDisplayDetail}
              levelConfig={{
                totalName: 'Total Income',
                colors: {
                  0: COLORS.DEPS_SUCCESS.LEVEL_1,
                  1: COLORS.DEPS_SUCCESS.LEVEL_2,
                  2: COLORS.DEPS_SUCCESS.LEVEL_3,
                },
              }}
            />
          </>
        )}
      </div>
      <DeleteDialog />
    </div>
  );
};

export default CategoryDashboard;
