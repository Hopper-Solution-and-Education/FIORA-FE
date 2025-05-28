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
import { Category } from '../../data/dto/response/CategoryResponseDTO';
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
        const categories = await budgetSummaryUseCase.getCategoriesByType(type);
        setCategoryList(categories);
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
      const planning = await budgetSummaryUseCase.getActualPlanningByCategory(
        categoryId,
        initialYear,
      );

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
                  ...planning.bottomUp,
                },
                {
                  key: `${categoryId}-actual`,
                  type: 'Actual sum-up',
                  isChild: true,
                  action: true,
                  isEditable: false,
                  ...planning.actual,
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

  useEffect(() => {
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
          getColumnsByPeriod(period, periodId, currency, categoryList, handleCategoryChange),
        );
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
        router.push(routeConfig(ApiEndpointEnum.Budgets));
      } finally {
        setIsLoading(false);
      }
    };

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

  console.log('Select Category: {}', selectedCategory);

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

      <div className="overflow-x-auto">
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
