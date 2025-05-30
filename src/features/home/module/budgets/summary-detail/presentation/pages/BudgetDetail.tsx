'use client';

import { CustomTable } from '@/components/common/tables/custom-table';
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApiEndpointEnum } from '@/shared/constants/ApiEnpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { useAppSelector } from '@/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum, PERIOD_OPTIONS } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Category, CategoryPlanningData } from '../../data/dto/response/CategoryResponseDTO';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { BudgetType } from '../../domain/entities/BudgetType';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { getColumnsByPeriod, getTableDataByPeriod } from '../../utils/transformDataForTable';
import {
  BudgetDetailFilterType,
  BudgetDetailType,
  BudgetPeriodIdType,
  BudgetPeriodType,
  TableData,
} from '../types/table.type';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BudgetDetailFilterType>(
    BudgetDetailFilterEnum.EXPENSE,
  );
  const [columns, setColumns] = useState<ColumnProps[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [editedData, setEditedData] = useState<{ [key: string]: any }>({});

  console.log(editedData);

  const { currency } = useAppSelector((state) => state.settings);

  const router = useRouter();

  const searchParams = useSearchParams();
  const period = (searchParams?.get('period') || BudgetDetailType.YEAR) as BudgetPeriodType;
  const periodId = (searchParams?.get('periodId') || 'year') as BudgetPeriodIdType;

  const budgetSummaryUseCase = useMemo(
    () => budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase),
    [],
  );

  // Fetch categories based on active tab
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const type = activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';
        const response = await budgetSummaryUseCase.getCategoriesByType(type);
        setCategoryList(response);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to fetch categories');
      }
    };

    fetchCategories();
  }, [activeTab, budgetSummaryUseCase]);

  const handleCategoryChange = async (categoryId: string) => {
    const selectedCategoryData = categoryList.find((cat) => cat.id === categoryId);
    if (!selectedCategoryData) return;

    setSelectedCategory(categoryId);
    setIsLoading(true);

    try {
      const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
        categoryId,
        initialYear,
      );

      // Transform budgetDetails into the format we need
      const bottomUpData =
        selectedCategoryData.budgetDetails?.reduce((acc, detail) => {
          if (detail.month) {
            const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
            acc[`m${detail.month}${suffix}`] = detail.amount || 0;
          }
          return acc;
        }, {} as CategoryPlanningData) || {};

      // Transform actual data
      const monthMap = {
        m1: 'jan',
        m2: 'feb',
        m3: 'mar',
        m4: 'apr',
        m5: 'may',
        m6: 'jun',
        m7: 'jul',
        m8: 'aug',
        m9: 'sep',
        m10: 'oct',
        m11: 'nov',
        m12: 'dec',
      };

      const transformedActualData = Object.entries(actualResponse).reduce(
        (acc, [key, value]) => {
          // Xử lý cho tháng (m1 -> jan, m2 -> feb, etc)
          if (key.match(/^m\d+_(exp|inc)$/)) {
            const monthKey = key.split('_')[0]; // m1, m2, etc
            const newKey = monthMap[monthKey as keyof typeof monthMap];
            if (newKey) {
              acc[newKey] = value as number;
            }
          }
          // Xử lý cho quý (q1 -> q1, etc)
          else if (key.match(/^q\d+_(exp|inc)$/)) {
            const quarterKey = key.split('_')[0]; // q1, q2, etc
            acc[quarterKey] = value as number;
          }
          // Xử lý cho nửa năm (h1 -> h1, etc)
          else if (key.match(/^h\d+_(exp|inc)$/)) {
            const halfKey = key.split('_')[0]; // h1, h2
            acc[halfKey] = value as number;
          }
          // Xử lý cho tổng năm
          else if (key.startsWith('total_')) {
            acc['fullYear'] = value as number;
          }
          return acc;
        },
        {} as { [key: string]: number },
      );

      console.log('Final transformed data:', transformedActualData);

      setTableData((prevData) => {
        return prevData.map((item) => {
          if (item.key === 'new-category') {
            return {
              ...item,
              type: selectedCategoryData.name,
              children: [
                {
                  key: `${categoryId}-bottom-up`,
                  type: 'Bottom-up Plan',
                  isChild: true,
                  action: true,
                  isEditable: true,
                  ...transformPlanningToTableData(bottomUpData),
                },
                {
                  key: `${categoryId}-actual`,
                  type: 'Actual sum-up',
                  isChild: true,
                  action: true,
                  isEditable: false,
                  ...transformedActualData,
                },
              ],
            };
          }
          return item;
        });
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch category planning data');
    } finally {
      setIsLoading(false);
    }
  };

  const transformPlanningToTableData = (planning: { [key: string]: number | string }) => {
    const result: { [key: string]: number } = {};
    Object.entries(planning).forEach(([key, value]) => {
      if (key.endsWith('_exp')) {
        const monthKey = key.replace('_exp', '');
        result[monthKey] = typeof value === 'string' ? parseFloat(value) : value;
      }
    });
    return result;
  };

  const fetchBudgetData = async () => {
    if (!initialYear) {
      toast.error('Invalid parameters');
      router.push(routeConfig(ApiEndpointEnum.Budgets));
      return;
    }

    setIsLoading(true);
    try {
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Act),
      ]);

      const mainData = getTableDataByPeriod(top, bot, act, activeTab);

      const dataWithCategory: TableData[] = [
        ...mainData,
        {
          key: 'new-category',
          type: '',
          isParent: true,
          action: true,
          children: [
            {
              key: 'bottom-up-plan',
              type: 'Bottom-up Plan',
              isChild: true,
              action: true,
              isEditable: true,
            },
            {
              key: 'actual-sum-up',
              type: 'Actual sum-up',
              isChild: true,
              action: true,
              isEditable: false,
            },
          ],
        },
      ];

      setTableData(dataWithCategory);
      setColumns(
        getColumnsByPeriod(
          period,
          periodId,
          currency,
          categoryList,
          handleCategoryChange,
          handleValidateClick,
          handleValueChange,
        ),
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
      router.push(routeConfig(ApiEndpointEnum.Budgets));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [
    initialYear,
    period,
    periodId,
    currency,
    activeTab,
    budgetSummaryUseCase,
    router,
    categoryList,
  ]);

  const handlePeriodChange = (value: string) => {
    const option = PERIOD_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      router.push(
        routeConfig(
          ApiEndpointEnum.BudgetDetail,
          { year: initialYear },
          { period: option.period, periodId: value },
        ),
      );
    }
  };

  const handleFilterChange = (value: string) => setActiveTab(value as BudgetDetailFilterType);

  const handleValueChange = (record: TableData, columnKey: string, value: number) => {
    setEditedData((prev) => ({
      ...prev,
      [record.key]: {
        ...(prev[record.key] || {}),
        [columnKey]: value,
      },
    }));

    setTableData((prevData) =>
      prevData.map((item) => {
        if (item.key === record.key) {
          return {
            ...item,
            [columnKey]: value,
          };
        } else if (item.children) {
          return {
            ...item,
            children: item.children.map((child: TableData) => {
              if (child.key === record.key) {
                return {
                  ...child,
                  [columnKey]: value,
                };
              }
              return child;
            }),
          };
        }
        return item;
      }),
    );
  };

  const handleValidateClick = async (record: TableData) => {
    setIsLoading(true);
    try {
      // Transform edited data into monthly planning format
      const monthlyData = Object.entries(record)
        .filter(([key]) => key.startsWith('m') && !isNaN(parseInt(key.charAt(1))))
        .reduce((acc, [key, value]) => {
          const monthKey = `m${parseInt(key.charAt(1))}_exp` as const;
          acc[monthKey] = typeof value === 'string' ? parseFloat(value) : value;
          return acc;
        }, {} as MonthlyPlanningData);

      if (record.key === 'top-down') {
        // Update top-down planning
        await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
          updateTopBudget: monthlyData,
        });
        toast.success('Top-down planning updated successfully');
      } else if (record.key.includes('-bottom-up') && selectedCategory) {
        // Update category bottom-up planning
        const [categoryId] = record.key.split('-bottom-up');
        await budgetSummaryUseCase.updateCategoryPlanning({
          fiscalYear: initialYear.toString(),
          type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
          categoryId,
          bottomUpPlan: monthlyData,
          actualSumUpPlan: {}, // Actual data is read-only
        });
        toast.success('Bottom-up planning updated successfully');
      }

      // Refresh data
      await fetchBudgetData();
      setEditedData({}); // Reset edited data after successful update
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update planning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline">{initialYear}</Button>

          <Select onValueChange={handlePeriodChange} value={periodId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs defaultValue="expense" value={activeTab} onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="w-[50rem] min-w-full">
        <div className="w-full">
          <CustomTable
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            rowKey="key"
            bordered
            layoutBorder
            showHeader
            rowHover
            pagination={false}
            scroll={{ x: 1400 }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
