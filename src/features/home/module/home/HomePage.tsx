'use client';
import StackedBarChart, { StackedChartDataItem } from '@/components/common/stacked-bar-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MODULE } from '@/shared/constants';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useFeatureFlagGuard } from '@/shared/hooks/useFeatureFlagGuard';
import { useState } from 'react';
import AccountDashboard from '../account/AccountDashboard';
import { AccountsOverview } from './AccountOverview';
import RecentTransactions from './components/RecentTransactions';
import Recommendations from './components/Recommendations';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const generateStackedData = (): StackedChartDataItem[] => [
  {
    id: 'expense',
    name: 'Expense',
    layer1: 30000, // Primary expense
    layer2: 15000, // Secondary expense
    layer3: 5000, // Tertiary expense
    type: 'expense',
    children: [
      {
        id: 'expense-1',
        name: 'Office Rent',
        layer1: 12000,
        layer2: 6000,
        layer3: 2000,
        type: 'expense',
        children: [
          {
            id: 'expense-1-1',
            name: 'Main Office',
            layer1: 8000,
            layer2: 4000,
            layer3: 1500,
            type: 'expense',
          },
          {
            id: 'expense-1-2',
            name: 'Satellite Office',
            layer1: 4000,
            layer2: 2000,
            layer3: 500,
            type: 'expense',
          },
        ],
      },
      {
        id: 'expense-2',
        name: 'Salaries',
        layer1: 18000,
        layer2: 9000,
        layer3: 3000,
        type: 'expense',
        children: [
          {
            id: 'expense-2-1',
            name: 'Engineering',
            layer1: 10000,
            layer2: 5000,
            layer3: 2000,
            type: 'expense',
          },
          {
            id: 'expense-2-2',
            name: 'Marketing',
            layer1: 8000,
            layer2: 4000,
            layer3: 1000,
            type: 'expense',
          },
        ],
      },
    ],
  },
  {
    id: 'income',
    name: 'Income',
    layer1: 50000,
    layer2: 25000,
    layer3: 10000,
    type: 'income',
    children: [
      {
        id: 'income-1',
        name: 'Product Sales',
        layer1: 35000,
        layer2: 17500,
        layer3: 7000,
        type: 'income',
        children: [
          {
            id: 'income-1-1',
            name: 'Software Licenses',
            layer1: 25000,
            layer2: 12500,
            layer3: 5000,
            type: 'income',
          },
          {
            id: 'income-1-2',
            name: 'Support Contracts',
            layer1: 10000,
            layer2: 5000,
            layer3: 2000,
            type: 'income',
          },
        ],
      },
      {
        id: 'income-2',
        name: 'Services',
        layer1: 15000,
        layer2: 7500,
        layer3: 3000,
        type: 'income',
        children: [
          {
            id: 'income-2-1',
            name: 'Consulting',
            layer1: 10000,
            layer2: 5000,
            layer3: 2000,
            type: 'income',
          },
          {
            id: 'income-2-2',
            name: 'Training',
            layer1: 5000,
            layer2: 2500,
            layer3: 1000,
            type: 'income',
          },
        ],
      },
    ],
  },
  {
    id: 'profit',
    name: 'Profit',
    layer1: 20000,
    layer2: 10000,
    layer3: 5000,
    type: 'profit',
    children: [
      {
        id: 'profit-1',
        name: 'Q1 Profit',
        layer1: 8000,
        layer2: 4000,
        layer3: 2000,
        type: 'profit',
      },
      {
        id: 'profit-2',
        name: 'Q2 Profit',
        layer1: 12000,
        layer2: 6000,
        layer3: 3000,
        type: 'profit',
      },
    ],
  },
];

export default function HomePage() {
  const { isFeatureOn } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE, MODULE.HOME);
  const [data, setData] = useState<StackedChartDataItem[]>(generateStackedData());
  const [isLoading, setIsLoading] = useState(false);
  const [layerDepth, setLayerDepth] = useState(3);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateStackedData());
      setIsLoading(false);
    }, 1000);
  };

  const handleItemClick = (item: StackedChartDataItem) => {
    console.log('Item clicked:', item);
    // You can implement additional logic here
  };

  if (!isFeatureOn) {
    return null;
  }
  return (
    <div className="flex flex-1 flex-col space-y-4 p-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Home</h2>
        <div className="hidden items-center space-x-2 md:flex"></div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-10">
            {/* Left Section: Financial & Account Overview */}
            <div className="col-span-1 md:col-span-2 lg:col-span-7 space-y-4">
              <main className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  Financial Dashboard
                </h1>

                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Layer Depth:</span>
                    <select
                      value={layerDepth}
                      onChange={(e) => setLayerDepth(Number(e.target.value))}
                      className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm p-1"
                    >
                      <option value={1}>1 Layer</option>
                      <option value={2}>2 Layers</option>
                      <option value={3}>3 Layers</option>
                    </select>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>

                <Tabs defaultValue="chart" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Stacked View</TabsTrigger>
                    <TabsTrigger value="comparison">Comparison View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Overview 2025</CardTitle>
                        <CardDescription>
                          Stacked visualization with {layerDepth} layer{layerDepth > 1 ? 's' : ''}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StackedBarChart
                          data={data}
                          isLoading={isLoading}
                          onItemClick={handleItemClick}
                          title="Financial Summary"
                          currency="USD"
                          maxLayerDepth={layerDepth}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="comparison">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quarterly Comparison</CardTitle>
                        <CardDescription>
                          Compare stacked financial data across quarters
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <StackedBarChart
                            data={data}
                            isLoading={isLoading}
                            title="Q1 2025"
                            maxLayerDepth={layerDepth}
                          />
                          <StackedBarChart
                            data={data.map((item) => ({
                              ...item,
                              layer1: item.layer1 * 1.1,
                              layer2: item.layer2 ? item.layer2 * 1.15 : undefined,
                              layer3: item.layer3 ? item.layer3 * 1.2 : undefined,
                              children: item.children?.map((child) => ({
                                ...child,
                                layer1: child.layer1 * 1.1,
                                layer2: child.layer2 ? child.layer2 * 1.15 : undefined,
                                layer3: child.layer3 ? child.layer3 * 1.2 : undefined,
                                children: child.children?.map((grandchild) => ({
                                  ...grandchild,
                                  layer1: grandchild.layer1 * 1.1,
                                  layer2: grandchild.layer2 ? grandchild.layer2 * 1.15 : undefined,
                                  layer3: grandchild.layer3 ? grandchild.layer3 * 1.2 : undefined,
                                })),
                              })),
                            }))}
                            isLoading={isLoading}
                            title="Q2 2025"
                            maxLayerDepth={layerDepth}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </main>

              {isFeatureOn && <AccountDashboard module={MODULE.HOME} />}
              <AccountsOverview />
            </div>

            {/* Right Section: Transactions & Recommendations */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
              <RecentTransactions />
              <Recommendations />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
