'use client';

import { fetchCategories } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/actions';
import { Category } from '@/features/setting/presentation/settingSlices/expenseIncomeSlides/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { CategoryType } from '@prisma/client';
import { useEffect, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';
import { formatCurrency } from '@/shared/utils';

interface CategoryChartData extends Category {
  color: string;
  convertedBalanceToRate: number;
}

const COLORS = {
  Expense: '#EF4444', // Red for expenses
  Income: '#10B981', // Green for income
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
  const { categories, selectedCategory } = useAppSelector((state) => state.expenseIncome);
  const { theme } = useTheme(); // Get the current theme

  // Determine if we're in dark mode
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const chartData = useMemo<CategoryChartData[]>(() => {
    if (!categories.data) return [];

    return categories.data.map((category: Category) => ({
      ...category,
      convertedBalanceToRate: parseFloat(category.balance.toString()),
      color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
    }));
  }, [categories]);

  if (categories.isLoading)
    return <div className="text-gray-800 dark:text-gray-200">Loading...</div>;
  if (categories.error)
    return <div className="text-red-600 dark:text-red-400">Error: {categories.error}</div>;

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Category Distribution
      </h2>

      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, bottom: 40, right: 20, left: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal
            vertical={false}
            stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
          />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value)}
            tick={{
              fontSize: 12,
              fill: isDarkMode ? '#D1D5DB' : '#4B5563',
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tickLine={false}
            tickFormatter={(value) => value}
            tick={{
              fontSize: 12,
              fill: isDarkMode ? '#D1D5DB' : '#4B5563',
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke={isDarkMode ? '#6B7280' : '#666'} />
          <Bar
            dataKey="convertedBalanceToRate"
            radius={[4, 4, 4, 4]}
            label={({ x, y, height, value }) => {
              const xPos = x + 20;
              return (
                <text
                  x={xPos}
                  y={y + height / 2}
                  fill={isDarkMode ? '#FFFFFF' : '#000000'}
                  fontSize={12}
                  fontWeight={500}
                  dominantBaseline="middle"
                >
                  {formatCurrency(value)}
                </text>
              );
            }}
          >
            {chartData.map((entry: CategoryChartData) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseIncomeDashboard;
