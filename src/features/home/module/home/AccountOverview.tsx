'use client';

import { Icons } from '@/components/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

// Dữ liệu giả lập
const initialData = [
  { year: '2021', income: 40000, expense: 25000, balance: 15000 },
  { year: '2022', income: 60000, expense: 35000, balance: 25000 },
  { year: '2023', income: 45000, expense: 30000, balance: 15000 },
  { year: '2024', income: 70000, expense: 40000, balance: 30000 },
  { year: '2025', income: 5000, expense: 3000, balance: 2000 },
];

export function AccountsOverview() {
  const { theme } = useTheme();
  const [chartColors, setChartColors] = useState({
    income: '#22c55e', // Màu xanh lá cho thu nhập
    expense: '#ef4444', // Màu đỏ cho chi tiêu
    balance: '#3b82f6', // Màu xanh dương cho số dư
  });

  // Cập nhật màu sắc dựa theo theme của Next.js
  useEffect(() => {
    if (theme === 'dark') {
      setChartColors({
        income: '#16a34a', // Màu xanh lá đậm hơn
        expense: '#dc2626', // Màu đỏ đậm hơn
        balance: '#1d4ed8', // Màu xanh dương đậm hơn
      });
    } else {
      setChartColors({
        income: '#22c55e',
        expense: '#ef4444',
        balance: '#3b82f6',
      });
    }
  }, [theme]);

  return (
    <Card className="p-4">
      {/* Tiêu đề */}
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Finance Chart</CardTitle>
        <Icons.wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="mt-6 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={initialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()} USD`} />
              <Legend />

              <Bar dataKey="income" fill={chartColors.income} name="Income" />
              <Bar dataKey="expense" fill={chartColors.expense} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
