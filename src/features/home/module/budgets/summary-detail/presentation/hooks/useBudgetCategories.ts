// src/presentation/hooks/useBudgetCategories.ts
import { useEffect } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import {
  createMonthlyData,
  transformMonthlyDataToTableFormat,
} from '../../utils/dataTransformations';
import { BudgetDetailFilterType, TableData } from '../types/table.type';
import { BudgetInit } from './useBudgetInit';

interface UseBudgetCategoriesProps {
  activeTab: BudgetDetailFilterType;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  initialYear: number;
  table: BudgetInit<TableData>;
  categories: BudgetInit<Category>;
  period?: string;
  periodId?: string;
}

export function useBudgetCategories({
  activeTab,
  budgetSummaryUseCase,
  categories,
  table,
  initialYear,
  periodId,
}: UseBudgetCategoriesProps) {
  useEffect(() => {
    categories.fetch();
  }, [activeTab, budgetSummaryUseCase, periodId]);

  useEffect(() => {
    const updateTableDataWithCreatedCategories = async () => {
      const createdCategories = categories.data.filter((cat) => cat.isCreated === true);
      if (createdCategories.length > 0) {
        const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

        try {
          const categoriesWithData = await Promise.all(
            createdCategories.map(async (cat) => {
              const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
                cat.id,
                initialYear,
              );

              const bottomUpData = cat.bottomUpPlan as MonthlyPlanningData;

              const actualData: MonthlyPlanningData = createMonthlyData(actualResponse, suffix);

              return {
                key: cat.id,
                type: cat.name,
                categoryId: cat.id,
                isParent: true,
                action: true,
                children: [
                  {
                    key: `${cat.id}-bottom-up`,
                    type: 'Bottom-up Plan',
                    isChild: true,
                    action: true,
                    isEditable: true,
                    ...transformMonthlyDataToTableFormat(bottomUpData),
                  },
                  {
                    key: `${cat.id}-actual`,
                    type: 'Actual sum-up',
                    isChild: true,
                    action: true,
                    isEditable: false,
                    ...transformMonthlyDataToTableFormat(actualData),
                  },
                ],
              };
            }),
          );

          table.set((prevData) => {
            const baseRows = prevData.slice(0, 3);
            return [...baseRows, ...categoriesWithData];
          });
        } catch (error: any) {
          toast.error(error.message || 'Failed to fetch category data');
        }
      }
    };

    updateTableDataWithCreatedCategories();
  }, [categories.data]);

  const handleCategoryChange = async (categoryId: string, parentKey?: string) => {
    const selectedCategoryData = categories.data.find((cat) => cat.id === categoryId);
    if (!selectedCategoryData) return;

    try {
      const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
        categoryId,
        initialYear,
      );

      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      const bottomUpData = selectedCategoryData.bottomUpPlan as MonthlyPlanningData;

      const actualData: MonthlyPlanningData = createMonthlyData(actualResponse, suffix);

      table.set((prevData) =>
        prevData.map((item) => {
          if (item.key === parentKey) {
            return {
              ...item,
              type: selectedCategoryData.name,
              categoryId,
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
                  ...transformMonthlyDataToTableFormat(actualData),
                },
              ],
            };
          }
          return item;
        }),
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch category planning data');
    }
  };

  return { handleCategoryChange };
}
