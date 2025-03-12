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

interface CategoryChartData extends Category {
  color: string;
  convertedBalanceToRate: number;
}

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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    console.log('payload', payload);
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm">
          Type: <span className="font-bold">{payload[0].payload.type}</span>
        </p>
        <p className="text-sm">
          Balance: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
        </p>
        {payload[0].payload.parentId && (
          <p className="text-sm">
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

  // Fetch categories on mount using Redux thunk
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Process data to create a flat structure with parent information and balance
  const chartData = useMemo<CategoryChartData[]>(() => {
    if (!categories.data) return [];

    const totalBalance = categories.data.reduce((acc, category) => acc + category.balance, 0);
    console.log('totalBalance', totalBalance);
    return categories.data.map((category: Category) => ({
      ...category,
      convertedBalanceToRate: totalBalance
        ? parseFloat((totalBalance / category.balance).toFixed(2))
        : 0,
      color: category.type === CategoryType.Expense ? COLORS.Expense : COLORS.Income,
    }));
  }, [categories]);

  if (categories.isLoading) return <div>Loading...</div>;
  if (categories.error) return <div>Error: {categories.error}</div>;

  console.log('chartData', chartData);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Category Distribution</h2>

      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, bottom: 40, left: 50, right: 20 }} // Increased right margin
        >
          <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }} // Font size adjustment for axis ticks
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100} // Increased width for better label visibility
            tickLine={false}
            tickFormatter={(value) => value}
            tick={{ fontSize: 12 }} // Font size adjustment for Y-axis ticks
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#666" />
          <Bar
            dataKey="convertedBalanceToRate"
            radius={[4, 4, 4, 4]}
            label={({ x, y, width, height, value, color }) => {
              const xPos = x + width + 10;
              return (
                <text x={xPos} y={y + height / 2} fill={color} fontSize={12} textAnchor="start">
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
          <span className="text-sm text-gray-600">Expenses</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseIncomeDashboard;
