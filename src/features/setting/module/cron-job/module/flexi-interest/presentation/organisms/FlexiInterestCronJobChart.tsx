'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyNumber } from '@/shared/utils/currencyFormat';
import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FlexiInterestStatistics } from '../slices/type';

interface FlexiInterestCronJobChartProps {
  data: FlexiInterestStatistics;
  loading?: boolean;
}

const FlexiInterestCronJobChart: FC<FlexiInterestCronJobChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flexi Interest by Tier</CardTitle>
          <CardDescription>Interest amounts distributed across membership tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Flexi Interest by Tier</CardTitle>
          <CardDescription>Interest amounts distributed across membership tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flexi Interest by Tier</CardTitle>
        <CardDescription>
          Total:{' '}
          <span className="font-semibold text-primart">
            {formatCurrencyNumber(data.totalAmount)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis tickFormatter={(value) => formatCurrencyNumber(value)} fontSize={12} />
            <Tooltip
              formatter={(value: number) => formatCurrencyNumber(value)}
              labelStyle={{ color: '#000' }}
            />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FlexiInterestCronJobChart;
