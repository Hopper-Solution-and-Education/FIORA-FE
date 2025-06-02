// src/presentation/hooks/useBudgetTableData.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { useRouter } from 'next/navigation';
import {
  BudgetDetailFilterType,
  TableData,
  MONTHS,
  BudgetPeriodType,
  BudgetPeriodIdType,
} from '../types/table.type';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { useBudgetData } from './useBudgetData';
import { transformMonthlyData } from '../../utils/dataTransformations';
import { BudgetDetailFilterEnum } from '../../data/constants';

interface UseBudgetTableDataProps {
  initialYear: number;
  activeTab: BudgetDetailFilterType;
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  currency: string;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  setSelectedCategories: (categories: Set<string>) => void;
}

export function useBudgetTableData({
  initialYear,
  activeTab,
  period,
  periodId,
  currency,
  budgetSummaryUseCase,
  setSelectedCategories,
}: UseBudgetTableDataProps) {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const router = useRouter();
  const { isLoading, fetchBudgetData } = useBudgetData(budgetSummaryUseCase);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBudgetData(initialYear, activeTab);
        setTableData(data || []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
        router.push(routeConfig(RouteEnum.Budgets));
      }
    };

    loadData();
  }, [initialYear, period, periodId, currency, activeTab]);

  useEffect(() => {
    const selectedCategoryIds = new Set<string>();
    tableData.forEach((item) => {
      if (item.categoryId) {
        selectedCategoryIds.add(item.categoryId);
      }
    });
    setSelectedCategories(selectedCategoryIds);
  }, [tableData, setSelectedCategories]);

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

  const handleValidateClick = async (record: TableData) => {
    try {
      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      if (record.key === 'top-down') {
        const monthlyData = transformMonthlyData(record, activeTab);
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

        const bottomUpData = transformMonthlyData(record, activeTab);

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
          MONTHS.forEach((month, index) => {
            const value = actualRecord[month];
            if (typeof value === 'number') {
              const monthKey = `m${index + 1}${suffix}` as keyof MonthlyPlanningData;
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
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update planning');
    }
  };

  return {
    tableData,
    setTableData,
    isLoading,
    handleValueChange,
    handleValidateClick,
  };
}
