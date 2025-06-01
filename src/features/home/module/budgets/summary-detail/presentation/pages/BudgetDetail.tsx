'use client';

import { TableV2 } from '@/components/common/tables/custom-table';
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
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { useAppSelector } from '@/store';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum, PERIOD_OPTIONS } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { getColumnsByPeriod } from '../../utils/transformDataForTable';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import { useBudgetData } from '../hooks/useBudgetData';
import { useCategoryManagement } from '../hooks/useCategoryManagement';
import {
  BudgetDetailFilterType,
  BudgetDetailType,
  BudgetPeriodIdType,
  BudgetPeriodType,
  TableData,
} from '../types/table.type';
import ActionButton from '@/components/common/UIKit/Button/ActionButton';

interface BudgetDetailProps {
  year: number;
}

const BudgetDetail = ({ year: initialYear }: BudgetDetailProps) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [activeTab, setActiveTab] = useState<BudgetDetailFilterType>(
    BudgetDetailFilterEnum.EXPENSE,
  );
  const [columns, setColumns] = useState<ColumnProps[]>([]);
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

  const { isLoading, fetchBudgetData } = useBudgetData(budgetSummaryUseCase);
  const {
    categoryRows,
    selectedCategories,
    setSelectedCategories,
    handleAddCategory,
    handleCategorySelected,
    handleRemoveCategory,
  } = useCategoryManagement();

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

    const quarterMap = {
      q1: 'q1',
      q2: 'q2',
      q3: 'q3',
      q4: 'q4',
    };

    const halfYearMap = {
      h1: 'h1',
      h2: 'h2',
    };

    const result: { [key: string]: number } = {};
    Object.entries(data).forEach(([key, value]) => {
      const monthNumber = key.match(/m(\d+)_/)?.[1];
      if (monthNumber) {
        const monthKey = monthMap[`m${monthNumber}` as keyof typeof monthMap];
        if (monthKey) {
          result[monthKey] = value;
        }
      }

      const quarterNumber = key.match(/q(\d+)_/)?.[1];
      if (quarterNumber) {
        const quarterKey = quarterMap[`q${quarterNumber}` as keyof typeof quarterMap];
        if (quarterKey) {
          result[quarterKey] = value;
        }
      }

      const halfYearNumber = key.match(/h(\d+)_/)?.[1];
      if (halfYearNumber) {
        const halfYearKey = halfYearMap[`h${halfYearNumber}` as keyof typeof halfYearMap];
        if (halfYearKey) {
          result[halfYearKey] = value;
        }
      }

      if (key.startsWith('total_')) {
        result['fullYear'] = value;
      }
    });

    return result;
  };

  useEffect(() => {
    const selectedCategoryIds = new Set<string>();
    tableData.forEach((item) => {
      if (item.categoryId) {
        selectedCategoryIds.add(item.categoryId);
      }
    });
    setSelectedCategories(selectedCategoryIds);
  }, [tableData]);

  const handleCategoryChange = async (categoryId: string, parentKey?: string) => {
    const selectedCategoryData = categoryList.find((cat) => cat.id === categoryId);
    if (!selectedCategoryData) return;

    try {
      const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
        categoryId,
        initialYear,
      );

      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      const bottomUpData =
        selectedCategoryData.budgetDetails?.reduce((acc, detail) => {
          if (detail.month) {
            acc[`m${detail.month}${suffix}`] = detail.amount || 0;
          }
          return acc;
        }, {} as MonthlyPlanningData) || {};

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

      const tableActualData = transformMonthlyDataToTableFormat(actualData);

      setTableData((prevData) => {
        return prevData.map((item) => {
          if (item.key === parentKey) {
            return {
              ...item,
              type: selectedCategoryData.name,
              categoryId: categoryId,
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
    }
  };

  const loadData = async () => {
    try {
      const data = await fetchBudgetData(initialYear, activeTab);
      setTableData(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
      router.push(routeConfig(RouteEnum.Budgets));
    }
  };

  useEffect(() => {
    loadData();
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
          RouteEnum.BudgetDetail,
          { year: initialYear },
          { period: option.period, periodId: value },
        ),
      );
    }
  };

  const handleFilterChange = (value: string) => setActiveTab(value as BudgetDetailFilterType);

  const handleValueChange = (record: TableData, columnKey: string, value: number) => {
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
        const [categoryId] = record.key.split('-bottom-up');

        if (!categoryId) {
          toast.error('Invalid category ID');
          return;
        }

        const bottomUpData = transformMonthlyData(record);

        const newCategoryRow = tableData.find((item) => item.key === 'new-category');

        const actualRecord = newCategoryRow?.children?.find((child: TableData) => {
          return child.key === 'actual-sum-up';
        });

        const actualData: MonthlyPlanningData = {};
        for (let i = 1; i <= 12; i++) {
          const monthKey = `m${i}${suffix}` as keyof MonthlyPlanningData;
          actualData[monthKey] = 0;
        }

        if (actualRecord) {
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
            const value = actualRecord[month];
            if (typeof value === 'number') {
              const monthKey = `m${num}${suffix}` as keyof MonthlyPlanningData;
              actualData[monthKey] = value;
            }
          });
        }

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
      // await fetchBudgetData(initialYear, activeTab);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update planning');
    }
  };

  useEffect(() => {
    const updatedColumns = getColumnsByPeriod(
      period,
      periodId,
      currency,
      categoryList,
      handleCategoryChange,
      handleValidateClick,
      handleValueChange,
    );

    const columnsWithCategorySelect = [
      {
        title: 'CATEGORY',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        render: (value: string, record: TableData) => {
          if (categoryRows.includes(record.key)) {
            const availableCategories = categoryList.filter(
              (category) =>
                !selectedCategories.has(category.id) || category.id === record.categoryId,
            );

            return (
              <div className="flex items-center gap-2">
                <Select
                  value={record.categoryId || undefined}
                  onValueChange={(selectedValue) => {
                    const category = categoryList.find((cat) => cat.id === selectedValue);
                    if (category) {
                      // Update selected categories
                      setSelectedCategories((prev) => {
                        const next = new Set(prev);
                        if (record.categoryId) {
                          next.delete(record.categoryId);
                        }
                        next.add(selectedValue);
                        return next;
                      });

                      // Sử dụng hàm handleCategorySelected mới
                      handleCategorySelected(
                        record.key,
                        selectedValue,
                        setTableData,
                        category.name,
                      );

                      // Sau đó gọi handleCategoryChange để lấy dữ liệu
                      handleCategoryChange(selectedValue, record.key);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }
          return (
            <div className="flex items-center justify-between">
              <span>{value}</span>
              {record.isParent && record.categoryId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCategory(record.key, setTableData, tableData)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
      ...updatedColumns.slice(1).map((column) => ({
        ...column,
        render: (value: any, record: TableData) => {
          if (categoryRows.includes(record.key)) {
            return null;
          }
          return column.render ? column.render(value, record, 2) : value;
        },
      })),
    ];

    setColumns(columnsWithCategorySelect);
  }, [period, periodId, currency, categoryList, activeTab, categoryRows, selectedCategories]);

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-4">
          <BudgetSummaryYearSelect
            selectedYear={initialYear}
            route={routeConfig(RouteEnum.BudgetDetail, {}, { period, periodId })}
          />

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

          <div className="ml-auto">
            <ActionButton
              tooltipContent="Add New Category"
              showIcon={true}
              onClick={() => handleAddCategory(setTableData)}
            />
          </div>
        </div>
      </div>

      <div className="w-[50rem] min-w-full">
        <div className="w-full">
          <TableV2
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
            className="w-full scrollbar-thin"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetDetail;
