// src/presentation/hooks/useBudgetCategories.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterType, TableData } from '../types/table.type';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { transformMonthlyDataToTableFormat } from '../../utils/dataTransformations';
import { BudgetDetailFilterEnum } from '../../data/constants';

interface UseBudgetCategoriesProps {
  activeTab: BudgetDetailFilterType;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  setTableData: React.Dispatch<React.SetStateAction<TableData[]>>;
  initialYear: number;
  period?: string;
  periodId?: string;
}

export function useBudgetCategories({
  activeTab,
  budgetSummaryUseCase,
  setTableData,
  initialYear,
  periodId,
}: UseBudgetCategoriesProps) {
  const [categoryList, setCategoryList] = useState<Category[]>([]);

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
  }, [activeTab, budgetSummaryUseCase, setTableData, periodId]);

  useEffect(() => {
    const updateTableDataWithCreatedCategories = async () => {
      const createdCategories = categoryList.filter((cat) => cat.isCreated === true);
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

          setTableData((prevData) => {
            const baseRows = prevData.slice(0, 3);
            return [...baseRows, ...categoriesWithData];
          });
        } catch (error: any) {
          toast.error(error.message || 'Failed to fetch category data');
        }
      }
    };

    updateTableDataWithCreatedCategories();
  }, [categoryList]);

  const handleCategoryChange = async (categoryId: string, parentKey?: string) => {
    const selectedCategoryData = categoryList.find((cat) => cat.id === categoryId);
    if (!selectedCategoryData) return;

    try {
      const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
        categoryId,
        initialYear,
      );

      const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';

      const bottomUpData = selectedCategoryData.bottomUpPlan as MonthlyPlanningData;

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

      setTableData((prevData) =>
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

  return { categoryList, handleCategoryChange };
}
