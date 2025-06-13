/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import NestedBarChart from '@/components/common/charts/nested-bar-chart';
import { BarItem } from '@/components/common/charts/nested-bar-chart/type';
import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';
import DeleteDialog from '@/features/home/module/category/components/DeleteDialog';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { Category } from '@/features/home/module/category/slices/types';
import { COLORS } from '@/shared/constants/chart';
import { convertVNDToUSD, formatCurrency } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import DashboardHeading from './components/DashboardHeading';

const CategoryDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, filterCriteria } = useAppSelector((state) => state.category);
  const { currency } = useAppSelector((state) => state.settings);

  // * INITIALIZATION CHART DATA ZONE
  const chartData: BarItem[] = useMemo(() => {
    if (!categories.data) return [];
    return categories.data.map((category: Category) => {
      const balance = category.balance || 0;
      const convertedBalance = currency === 'USD' ? convertVNDToUSD(balance) : balance;

      return {
        id: category.id,
        name: category.name,
        value: convertedBalance,
        icon: category.icon,
        color:
          category.type === CategoryType.Expense
            ? COLORS.DEPS_DANGER.LEVEL_1
            : COLORS.DEPS_SUCCESS.LEVEL_1,
        type: category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
        children: category.subCategories?.map((subCategory) => {
          const subBalance = subCategory.balance || 0;
          const convertedSubBalance = currency === 'USD' ? convertVNDToUSD(subBalance) : subBalance;

          return {
            id: subCategory.id,
            name: subCategory.name,
            value: convertedSubBalance,
            icon: subCategory.icon,
            color:
              category.type === CategoryType.Expense
                ? COLORS.DEPS_DANGER.LEVEL_1
                : COLORS.DEPS_SUCCESS.LEVEL_1,
            type:
              category.type === CategoryType.Expense ? CategoryType.Expense : CategoryType.Income,
          };
        }),
      };
    });
  }, [categories.data, currency]);

  // Sort and filter expense data
  const expenseData = useMemo(() => {
    const expenses = chartData.filter((item) => item.type === CategoryType.Expense);
    return [...expenses].sort((a, b) => b.value - a.value);
  }, [chartData]);

  // Sort and filter income data
  const incomeData = useMemo(() => {
    const incomes = chartData.filter((item) => item.type === CategoryType.Income);
    return [...incomes].sort((a, b) => b.value - a.value);
  }, [chartData]);

  // * HANDLERS FUNCTIONS ZONE
  const handleDisplayDetail = (item: any) => {
    if (item.id) {
      router.push(`/category/update/${item.id}`);
    }
  };

  // * USE EFFECT ZONE
  useEffect(() => {
    dispatch(fetchCategories(filterCriteria));
  }, [dispatch]);

  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <div className="p-4 md:px-6">
      <DashboardHeading />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              xAxisFormatter={(value) => formatCurrency(value, currency)}
              currency={currency}
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
              xAxisFormatter={(value) => formatCurrency(value, currency)}
              currency={currency}
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
