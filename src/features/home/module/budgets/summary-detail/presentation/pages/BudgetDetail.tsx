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
  const [editedData, setEditedData] = useState<{ [key: string]: any }>({});

  console.log(editedData, selectedCategory);

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

  const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
    console.log('Transforming data to table format:', data);
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

    const result: { [key: string]: number } = {};
    Object.entries(data).forEach(([key, value]) => {
      // key format: m1_exp, m2_exp, etc.
      const monthNumber = key.match(/m(\d+)_/)?.[1];
      if (monthNumber) {
        const monthKey = monthMap[`m${monthNumber}` as keyof typeof monthMap];
        if (monthKey) {
          result[monthKey] = value;
        }
      }
    });

    console.log('Transformed table format:', result);
    return result;
  };

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
      console.log('API Response for actual data:', actualResponse);

      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      // Transform budgetDetails into the format we need
      const bottomUpData =
        selectedCategoryData.budgetDetails?.reduce((acc, detail) => {
          if (detail.month) {
            acc[`m${detail.month}${suffix}`] = detail.amount || 0;
          }
          return acc;
        }, {} as MonthlyPlanningData) || {};

      // Transform actual data directly from API response
      const actualData: MonthlyPlanningData = {
        [`m1${suffix}`]: actualResponse[`m1${suffix}`] || 0,
        [`m2${suffix}`]: actualResponse[`m2${suffix}`] || 0,
        [`m3${suffix}`]: actualResponse[`m3${suffix}`] || 0,
        [`m4${suffix}`]: actualResponse[`m4${suffix}`] || 0,
        [`m5${suffix}`]: actualResponse[`m5${suffix}`] || 0,
        [`m6${suffix}`]: actualResponse[`m6${suffix}`] || 0,
        [`m7${suffix}`]: actualResponse[`m7${suffix}`] || 0,
        [`m8${suffix}`]: actualResponse[`m8${suffix}`] || 0,
        [`m9${suffix}`]: actualResponse[`m9${suffix}`] || 0,
        [`m10${suffix}`]: actualResponse[`m10${suffix}`] || 0,
        [`m11${suffix}`]: actualResponse[`m11${suffix}`] || 0,
        [`m12${suffix}`]: actualResponse[`m12${suffix}`] || 0,
      };
      console.log('Transformed actual data:', actualData);

      const tableActualData = transformMonthlyDataToTableFormat(actualData);
      console.log('Table format actual data:', tableActualData);

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
                  ...transformMonthlyDataToTableFormat(bottomUpData),
                },
                {
                  key: `${categoryId}-actual`,
                  type: 'Actual sum-up',
                  isChild: true,
                  action: true,
                  isEditable: false,
                  ...tableActualData,
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

  // Add transformMonthlyData function back
  const transformMonthlyData = (data: TableData): MonthlyPlanningData => {
    const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
    const monthMap = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };

    // Initialize with all months set to 0
    const result: MonthlyPlanningData = {};
    for (let i = 1; i <= 12; i++) {
      result[`m${i}${suffix}`] = 0;
    }

    // Update values from data
    Object.entries(data).forEach(([key, value]) => {
      const month = Object.keys(monthMap).find((m) => key === m);
      if (month) {
        const monthNumber = monthMap[month as keyof typeof monthMap];
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numericValue)) {
          result[`m${monthNumber}${suffix}`] = numericValue;
        }
      }
    });

    return result;
  };

  const handleValidateClick = async (record: TableData) => {
    console.log('Validate clicked for record:', record);
    setIsLoading(true);
    try {
      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      if (record.key === 'top-down') {
        const monthlyData = transformMonthlyData(record);
        await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
          updateTopBudget: monthlyData,
        });
        toast.success('Top-down planning updated successfully');
      } else if (record.key.includes('-bottom-up')) {
        console.log('Updating bottom-up plan');
        const [categoryId] = record.key.split('-bottom-up');
        console.log('Category ID:', categoryId);

        if (!categoryId) {
          toast.error('Invalid category ID');
          return;
        }

        const bottomUpData = transformMonthlyData(record);
        console.log('Bottom-up data:', bottomUpData);

        // Tìm actual data từ tableData
        console.log('Current tableData:', tableData);
        const newCategoryRow = tableData.find((item) => item.key === 'new-category');
        console.log('Found new-category row:', newCategoryRow);

        // Log tất cả children của new-category để kiểm tra
        console.log('Children of new-category:', newCategoryRow?.children);

        // Tìm actual record và log chi tiết
        const actualRecord = newCategoryRow?.children?.find((child: TableData) => {
          console.log('Checking child:', child);
          console.log('Expected key:', `actual-sum-up`);
          console.log('Child key:', child.key);
          return child.key === 'actual-sum-up';
        });

        console.log('Found actual record:', actualRecord);

        // Khởi tạo actualData với tất cả các tháng
        const actualData: MonthlyPlanningData = {};
        for (let i = 1; i <= 12; i++) {
          const monthKey = `m${i}${suffix}` as keyof MonthlyPlanningData;
          actualData[monthKey] = 0; // Khởi tạo mặc định là 0
        }

        // Nếu có actual record, cập nhật giá trị từ record
        if (actualRecord) {
          console.log('Updating actual data from record:', actualRecord);
          // Lấy giá trị từ các trường tháng (jan, feb, etc.)
          const monthMap = {
            jan: 1,
            feb: 2,
            mar: 3,
            apr: 4,
            may: 5,
            jun: 6,
            jul: 7,
            aug: 8,
            sep: 9,
            oct: 10,
            nov: 11,
            dec: 12,
          };

          Object.entries(monthMap).forEach(([month, num]) => {
            console.log(`Checking month ${month}:`, actualRecord[month]);
            const value = actualRecord[month];
            console.log('Value type:', typeof value);
            if (typeof value === 'number') {
              const monthKey = `m${num}${suffix}` as keyof MonthlyPlanningData;
              console.log(`Setting ${monthKey} to:`, value);
              actualData[monthKey] = value;
            }
          });
        }

        console.log('Final actual data for API:', actualData);

        await budgetSummaryUseCase.updateCategoryPlanning({
          fiscalYear: initialYear.toString(),
          type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
          categoryId,
          bottomUpPlan: bottomUpData,
          actualSumUpPlan: actualData,
        });
        toast.success('Bottom-up planning updated successfully');
      }

      // Refresh data
      await fetchBudgetData();
      setEditedData({}); // Reset edited data after successful update
    } catch (err: any) {
      console.error('Update failed:', err);
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
