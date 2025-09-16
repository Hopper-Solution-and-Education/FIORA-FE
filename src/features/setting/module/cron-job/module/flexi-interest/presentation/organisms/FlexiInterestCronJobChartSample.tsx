'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyNumber } from '@/shared/utils/currencyFormat';
import { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const sampleData = {
  status: 200,
  message: 'Get successfully',
  data: {
    tierInterestAmount: [
      { tierName: 'Silver Egg', interestAmount: '2000.00' },
      { tierName: 'Gold Dragon', interestAmount: '0' },
      { tierName: 'Diamond Egg', interestAmount: '0' },
      { tierName: 'Gold Egg', interestAmount: '3521.25' },
      { tierName: 'Silver Qilin', interestAmount: '0' },
      { tierName: 'Gold Phoenix', interestAmount: '0' },
      { tierName: 'Qili-Titan', interestAmount: '0' },
      { tierName: 'Diamond Dragon', interestAmount: '0' },
      { tierName: 'Silver Phoenix', interestAmount: '0' },
      { tierName: 'Gold Qilin', interestAmount: '0' },
      { tierName: 'Titan Phoenix', interestAmount: '4122.85' },
      { tierName: 'Diamond Phoenix', interestAmount: '0' },
      { tierName: 'Silver Dragon', interestAmount: '0' },
      { tierName: 'Platinum Qilin', interestAmount: '0' },
      { tierName: 'Titan Dragon', interestAmount: '0' },
      { tierName: 'Tortoise-Titan', interestAmount: '0' },
      { tierName: 'Diamond Tortoise', interestAmount: '0' },
      { tierName: 'Platinum Phoenix', interestAmount: '0' },
      { tierName: 'Platinum Tortoise', interestAmount: '0' },
      { tierName: 'Platinum Egg', interestAmount: '0' },
      { tierName: 'Titan Egg', interestAmount: '10' },
      { tierName: 'Platinum Dragon', interestAmount: '0' },
      { tierName: 'Diamond Qilin', interestAmount: '0' },
      { tierName: 'Silver Tortoise', interestAmount: '0' },
      { tierName: 'Gold Tortoise', interestAmount: '0' },
    ],
    totalInterestAmount: '4132.85',
  },
};

const FlexiInterestCronJobChartSample: FC = () => {
  const data = {
    chartData: sampleData.data.tierInterestAmount.map((item) => ({
      name: item.tierName,
      amount: parseFloat(item.interestAmount),
    })),
    totalAmount: parseFloat(sampleData.data.totalInterestAmount),
  };

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
    <div className="relative">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data.chartData} margin={{ top: 50, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(value) => formatCurrencyNumber(value)}
            fontSize={14}
            label={{
              value: 'Amount',
              position: 'top',
              offset: 20,
              style: {
                textAnchor: 'middle',
                fontSize: '14px',
                fontWeight: 'bold',
              },
            }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrencyNumber(value)}
            labelStyle={{ color: '#000' }}
          />
          <Bar dataKey="amount" fill="#FF8383" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute top-0 right-7 px-3 py-2 bg-gray-100 text-blue-600 font-semibold rounded-lg">
        Total: {formatCurrencyNumber(data.totalAmount)}
      </div>
    </div>
  );
};

export default FlexiInterestCronJobChartSample;
