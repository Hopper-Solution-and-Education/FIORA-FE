import { Currency } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { transformMonthlyData } from '../../utils/dataTransformations';
import {
  BudgetDetailFilterType,
  BudgetInit,
  BudgetPeriodIdType,
  BudgetPeriodType,
  MONTHS,
  TableData,
} from '../types/table.type';

interface UseBudgetTableDataProps {
  initialYear: number;
  activeTab: BudgetDetailFilterType;
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  currency: Currency;
  setSelectedCategories: (categories: Set<string>) => void;
  table: BudgetInit<TableData>;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
}

export function useBudgetTableData({
  initialYear,
  activeTab,
  period,
  periodId,
  currency,
  setSelectedCategories,
  table,
  budgetSummaryUseCase,
}: UseBudgetTableDataProps) {
  const router = useRouter();

  useEffect(() => {
    table.fetch();
  }, [initialYear, period, periodId, currency, activeTab, router]);

  useEffect(() => {
    const selectedCategoryIds = new Set<string>();
    table.data.forEach((item: TableData) => {
      if (item.categoryId) {
        selectedCategoryIds.add(item.categoryId);
      }
    });
    setSelectedCategories(selectedCategoryIds);
  }, [table.data, setSelectedCategories]);

  const handleValueChange = (record: TableData, columnKey: string, value: number) => {
    table.set((prevData) =>
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

        table.fetch();

        toast.success('Top-down planning updated successfully');
      } else if (record.key.includes('-bottom-up')) {
        const [categoryId] = record.key.split('-bottom-up');

        if (!categoryId) {
          toast.error('Invalid category ID');
          return;
        }

        const bottomUpData = transformMonthlyData(record, activeTab);

        const newCategoryRow = table.data.find((item: TableData) => item.key === 'new-category');

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

        await budgetSummaryUseCase.updateCategoryPlanning(
          {
            fiscalYear: initialYear.toString(),
            type: activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income',
            categoryId,
            bottomUpPlan: bottomUpData,
            actualSumUpPlan: actualData,
          },
          currency,
        );

        table.fetch();

        toast.success('Bottom-up planning updated successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update planning');
    }
  };

  return {
    handleValueChange,
    handleValidateClick,
  };
}
