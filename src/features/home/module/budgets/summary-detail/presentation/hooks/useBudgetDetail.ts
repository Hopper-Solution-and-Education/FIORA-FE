import { useAppSelector } from '@/store';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum, PERIOD_OPTIONS } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { BudgetType } from '../../domain/entities/BudgetType';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import {
  transformMonthlyDataToTableFormat,
  transformMonthlyPayload,
} from '../../utils/details/dataTransformations';
import { getTableDataByPeriod } from '../../utils/details/transformDataForTable';
import { BudgetDetailFilterType, TableData } from '../types/table.type';
import { useBudgetDetailDispatchContext } from './useBudgetDetailDispatchContext';
import { useBudgetDetailStateContext } from './useBudgetDetailStateContext';

// Helper function to convert tab to API type
const getTabType = (tab: BudgetDetailFilterType): 'Expense' | 'Income' => {
  return tab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';
};

// Helper function to get suffix for monthly data
const getTabSuffix = (tab: BudgetDetailFilterType): '_exp' | '_inc' => {
  return tab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
};

// Helper function to convert Budget to MonthlyPlanningData
const convertBudgetToMonthlyData = (
  budget: any,
  activeTab: BudgetDetailFilterType,
): MonthlyPlanningData => {
  if (!budget) return {};
  const suffix = getTabSuffix(activeTab); // _exp hoặc _inc
  const monthlyData: MonthlyPlanningData = {};

  console.log("budget", budget)

  for (const key in budget) {
    if (Object.prototype.hasOwnProperty.call(budget, key)) {
      // Chỉ lấy các trường đúng suffix hoặc tổng hợp đúng loại
      if (
        key.endsWith(suffix) ||
        (activeTab === BudgetDetailFilterEnum.EXPENSE && key === 'total_exp') ||
        (activeTab === BudgetDetailFilterEnum.INCOME && key === 'total_inc') ||
        (activeTab === BudgetDetailFilterEnum.EXPENSE && key.match(/^q\d_exp$|^h\d_exp$/)) ||
        (activeTab === BudgetDetailFilterEnum.INCOME && key.match(/^q\d_inc$|^h\d_inc$/))
      ) {
        const numValue = Number(budget[key]);
        monthlyData[key as keyof MonthlyPlanningData] = isNaN(numValue) ? 0 : numValue;
      }
    }
  }

  return monthlyData;
};

export function useBudgetDetail(initialYear: number) {
  const { state } = useBudgetDetailStateContext();
  const { dispatch } = useBudgetDetailDispatchContext();

  // Memo budgetSummaryUseCase to prevent unnecessary re-creation
  const budgetSummaryUseCase = useMemo(
    () => budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase),
    [],
  );

  const currency = useAppSelector((store) => store.settings.currency) || 'VND';

  // Fetch table data and categories
  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch categories
      const type = getTabType(state.activeTab);
      const categories = await budgetSummaryUseCase.getCategoriesByType(type, initialYear);
      dispatch({ type: 'SET_CATEGORY_LIST', payload: categories });

      // Fetch table data (top, bot, act)
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Act),
      ]);
      // Transform về TableData[]
      let tableData = getTableDataByPeriod(top, bot, act, state.activeTab);

      // Thêm originalData cho mỗi record để track changes
      const addOriginalData = (record: any) => {
        const originalData: any = {};
        Object.keys(record).forEach((key) => {
          if (typeof record[key] === 'object' && record[key]?.value !== undefined) {
            originalData[key] = { value: record[key].value };
          }
        });
        return { ...record, originalData, hasChanges: false };
      };

      // Thêm originalData cho tất cả records
      tableData = tableData.map(addOriginalData);

      // Thêm các category đã isCreated=true vào bảng nếu chưa có
      const createdCategories = categories.filter((cat: Category) => cat.isCreated);
      for (const cat of createdCategories) {
        if (!tableData.some((row) => row.categoryId === cat.id)) {
          const bottomUpData = transformMonthlyDataToTableFormat(
            (cat.bottomUpPlan as MonthlyPlanningData) || {},
          );
          const actualData = transformMonthlyDataToTableFormat(
            (cat.actualTransaction as MonthlyPlanningData) || {},
          );

          tableData.push({
            key: cat.id,
            type: cat.name,
            categoryId: cat.id,
            category: { value: cat.name },
            isParent: true,
            isCreated: true,
            action: true,
            originalData: {},
            hasChanges: false,
            children: [
              {
                key: `${cat.id}-bottom-up`,
                type: 'Bottom Up',
                isChild: true,
                action: true,
                isEditable: true,
                originalData: addOriginalData(bottomUpData).originalData,
                hasChanges: false,
                ...bottomUpData,
              },
              {
                key: `${cat.id}-actual`,
                type: 'Actual Sum Up',
                isChild: true,
                action: true,
                isEditable: false,
                originalData: addOriginalData(actualData).originalData,
                hasChanges: false,
                ...actualData,
              },
            ],
          });
        }
      }
      dispatch({ type: 'SET_TABLE_DATA', payload: tableData });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch budget detail data');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.activeTab, initialYear, dispatch, budgetSummaryUseCase]);

  // Handle period change
  const handlePeriodChange = (value: string) => {
    const option = PERIOD_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      dispatch({ type: 'SET_PERIOD', payload: option.period });
      dispatch({ type: 'SET_PERIOD_ID', payload: value });
    }
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: value as BudgetDetailFilterType });
  };

  // Add/remove category row
  const handleAddCategoryRow = () => {
    const newRowId = `new-category-${Date.now()}`;
    dispatch({ type: 'ADD_EMPTY_CATEGORY_ROW', payload: newRowId });
  };

  // Chọn category cho hàng trống, sẽ sinh 2 dòng con và fetch dữ liệu thực tế
  const handleCategorySelected = async (rowKey: string, category: Category) => {
    dispatch({ type: 'SET_CATEGORY_SELECTED', payload: { rowKey, category } });
    try {
      // Nếu category đã có dữ liệu, hiển thị luôn
      const suffix = getTabSuffix(state.activeTab);
      const bottomUpData = transformMonthlyDataToTableFormat(
        (category.bottomUpPlan as MonthlyPlanningData) || {},
      );
      const actualData = transformMonthlyDataToTableFormat(
        (category.actualTransaction as MonthlyPlanningData) || {},
      );

      // Thêm originalData cho bottomUpData và actualData
      const addOriginalData = (record: any) => {
        const originalData: any = {};
        Object.keys(record).forEach((key) => {
          if (typeof record[key] === 'object' && record[key]?.value !== undefined) {
            originalData[key] = { value: record[key].value };
          }
        });
        return { ...record, originalData, hasChanges: false };
      };

      const bottomUpWithOriginal = addOriginalData(bottomUpData);
      const actualWithOriginal = addOriginalData(actualData);

      dispatch({
        type: 'SET_CATEGORY_CHILD_DATA',
        payload: {
          rowKey,
          bottomUpData: bottomUpWithOriginal,
          actualData: actualWithOriginal,
        },
      });
      // Nếu muốn fetch actual từ API vẫn giữ lại đoạn fetch dưới đây
      // const actualResponse = await budgetSummaryUseCase.getActualPlanningByCategory(
      //   category.id,
      //   initialYear,
      // );
      // const actualData = transformMonthlyDataToTableFormat(createMonthlyData(actualResponse, suffix));
      // dispatch({ ... })
    } catch (err: any) {
      // Nếu lỗi vẫn giữ 2 dòng con rỗng
    }
  };

  // Thay đổi giá trị ô input (top-down hoặc bottom-up)
  const handleValueChange = (record: TableData, columnKey: string, value: any) => {
    // Cập nhật lại tableData trong state
    const newTableData = state.tableData.map((item) => {
      if (item.key === record.key) {
        // Kiểm tra xem có thay đổi so với giá trị gốc không
        const originalValue = (item.originalData as any)?.[columnKey]?.value;
        const hasChanges = originalValue !== value;
        return { ...item, [columnKey]: { value }, hasChanges };
      } else if (item.children) {
        return {
          ...item,
          children: item.children.map((child: TableData) => {
            if (child.key === record.key) {
              // Kiểm tra xem có thay đổi so với giá trị gốc không
              const originalValue = (child.originalData as any)?.[columnKey]?.value;
              const hasChanges = originalValue !== value;
              return { ...child, [columnKey]: { value }, hasChanges };
            }
            return child;
          }),
        };
      }
      return item;
    });
    dispatch({ type: 'SET_TABLE_DATA', payload: newTableData });
  };

  // Fetch data on mount or when year/tab/period changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Khi mới vào trang hoặc sau khi fetch, nếu chỉ có 3 dòng mặc định thì tự động thêm 1 hàng trống
  useEffect(() => {
    if (state.tableData.length === 3) {
      handleAddCategoryRow();
    }
  }, [state.tableData.length]);

  const setRowLoading = (rowKey: string, loading: boolean) => {
    dispatch({ type: 'SET_ROW_LOADING', payload: { rowKey, loading } });
  };

  const handleValidateClick = async (record: TableData) => {
    setRowLoading(record.key, true);
    try {
      const tabType = getTabType(state.activeTab);

      if (record.key === 'top-down') {
        // Update top-down and get new data back
        const updatedTopDown = await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: tabType,
          updateTopBudget: transformMonthlyPayload(record, state.activeTab),
        });

        // Convert Budget to MonthlyPlanningData and update only the top-down row
        const monthlyData = convertBudgetToMonthlyData(updatedTopDown, state.activeTab);

        const newTableData = state.tableData.map((item) => {
          if (item.key === 'top-down') {
            const updatedData = transformMonthlyDataToTableFormat(monthlyData);
            // Cập nhật originalData và reset hasChanges
            const originalData: any = {};
            Object.keys(updatedData).forEach((key) => {
              if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== undefined) {
                originalData[key] = { value: updatedData[key].value };
              }
            });
            const updatedItem = {
              ...item,
              ...updatedData,
              originalData,
              hasChanges: false,
            };
            return updatedItem;
          }
          return item;
        });

        dispatch({ type: 'SET_TABLE_DATA', payload: newTableData });
        toast.success('Top Down updated successfully!');
      } else if (record.key.includes('-bottom-up')) {
        const [categoryId] = record.key.split('-bottom-up');
        // Lấy actualSumUpPlan từ dòng con actual nếu có
        let actualSumUpPlan = {};

        const parentItem = state.tableData.find(
          (item) => item.children && item.children.some((child) => child.key === record.key),
        );

        if (parentItem && parentItem.children) {
          const actualChild = parentItem.children.find(
            (child) => child.key === `${categoryId}-actual`,
          );
          if (actualChild) {
            actualSumUpPlan = transformMonthlyPayload(actualChild, state.activeTab);
          }
        }

        // Update category planning and get new data back
        const updatedCategoryData = await budgetSummaryUseCase.updateCategoryPlanning(
          {
            fiscalYear: initialYear.toString(),
            type: tabType,
            categoryId,
            bottomUpPlan: transformMonthlyPayload(record, state.activeTab),
            actualSumUpPlan,
          },
          currency,
        );

        // Convert updatedBudgetDetails to MonthlyPlanningData for category
        const bottomUpMonthlyData: any = {};
        updatedCategoryData.updatedBudgetDetails.forEach((detail) => {
          if (detail && detail.month !== undefined && detail.amount !== undefined) {
            const monthKey = `m${detail.month}_${state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'exp' : 'inc'}`;
            bottomUpMonthlyData[monthKey] = Number(detail.amount);
          }
        });

        // Convert actBudgetDetails to MonthlyPlanningData for category
        const actualMonthlyData: any = {};
        updatedCategoryData.actBudgetDetails.forEach((detail) => {
          if (detail && detail.month !== undefined && detail.amount !== undefined) {
            const monthKey = `m${detail.month}_${state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'exp' : 'inc'}`;
            actualMonthlyData[monthKey] = Number(detail.amount);
          }
        });

        // Convert bottomUpBudget to MonthlyPlanningData for bottom budget row
        const bottomBudgetMonthlyData = convertBudgetToMonthlyData(
          updatedCategoryData.bottomUpBudget,
          state.activeTab,
        );

        const newTableData = state.tableData.map((item) => {
          if (item.categoryId === categoryId && item.children) {
            return {
              ...item,
              isCreated: true, // Set isCreated = true sau khi update thành công
              children: item.children.map((child) => {
                if (child.key === `${categoryId}-bottom-up`) {
                  const updatedData = transformMonthlyDataToTableFormat(bottomUpMonthlyData);
                  // Cập nhật originalData và reset hasChanges
                  const originalData: any = {};
                  Object.keys(updatedData).forEach((key) => {
                    if (
                      typeof updatedData[key] === 'object' &&
                      updatedData[key]?.value !== undefined
                    ) {
                      originalData[key] = { value: updatedData[key].value };
                    }
                  });
                  return {
                    ...child,
                    ...updatedData,
                    originalData,
                    hasChanges: false,
                  };
                }
                if (child.key === `${categoryId}-actual`) {
                  const updatedData = transformMonthlyDataToTableFormat(actualMonthlyData);
                  // Cập nhật originalData và reset hasChanges
                  const originalData: any = {};
                  Object.keys(updatedData).forEach((key) => {
                    if (
                      typeof updatedData[key] === 'object' &&
                      updatedData[key]?.value !== undefined
                    ) {
                      originalData[key] = { value: updatedData[key].value };
                    }
                  });
                  return {
                    ...child,
                    ...updatedData,
                    originalData,
                    hasChanges: false,
                  };
                }
                return child;
              }),
            };
          }
          // Update bottom budget row with new data
          if (item.key === 'bottom-up') {
            const updatedData = transformMonthlyDataToTableFormat(bottomBudgetMonthlyData);
            // Cập nhật originalData và reset hasChanges
            const originalData: any = {};
            Object.keys(updatedData).forEach((key) => {
              if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== undefined) {
                originalData[key] = { value: updatedData[key].value };
              }
            });
            return {
              ...item,
              ...updatedData,
              originalData,
              hasChanges: false,
            };
          }
          return item;
        });

        dispatch({ type: 'SET_TABLE_DATA', payload: newTableData });
        toast.success('Bottom Up updated successfully!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Update failed!');
    } finally {
      setRowLoading(record.key, false);
    }
  };

  // Xử lý nút X cho từng dòng
  const handleRemoveRow = async (record: TableData) => {
    const tabType = getTabType(state.activeTab);
    setRowLoading(record.key, true);
    try {
      if (record.key === 'top-down') {
        // Clear all values về 0
        const suffix = getTabSuffix(state.activeTab);
        const zeroPayload: MonthlyPlanningData = Object.fromEntries(
          Array.from({ length: 12 }, (_, i) => {
            const key = `m${i + 1}${suffix}` as keyof MonthlyPlanningData;
            return [key, 0];
          }),
        ) as MonthlyPlanningData;

        // Clear top-down and get new data back
        const clearedTopDown = await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: tabType,
          updateTopBudget: zeroPayload,
        });

        // Convert Budget to MonthlyPlanningData and update only the top-down row
        const monthlyData = convertBudgetToMonthlyData(clearedTopDown, state.activeTab);
        const newTableData = state.tableData.map((item) => {
          if (item.key === 'top-down') {
            return {
              ...item,
              ...transformMonthlyDataToTableFormat(monthlyData),
            };
          }
          return item;
        });

        dispatch({ type: 'SET_TABLE_DATA', payload: newTableData });
        toast.success('Top Down cleared successfully!');
      } else if (record.key.includes('-bottom-up')) {
        // Tìm parent row
        const [categoryId] = record.key.split('-bottom-up');
        const parentItem = state.tableData.find((item) => item.categoryId === categoryId);
        if (parentItem?.isCreated) {
          // Gọi API xóa category
          await budgetSummaryUseCase.deleteCategory({
            fiscalYear: initialYear.toString(),
            type: tabType,
            categoryId,
          });

          // Remove the category row from table
          const newTableData = state.tableData.filter((row) => row.key !== parentItem.key);
          dispatch({ type: 'SET_TABLE_DATA', payload: newTableData });
          toast.success('Category deleted successfully!');
        } else if (parentItem) {
          // Chỉ remove khỏi bảng (local)
          dispatch({ type: 'REMOVE_CATEGORY_ROW', payload: parentItem.key });
          dispatch({
            type: 'SET_TABLE_DATA',
            payload: state.tableData.filter((row) => row.key !== parentItem.key),
          });
          toast.success('Category removed from table!');
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Action failed!');
    } finally {
      setRowLoading(record.key, false);
    }
  };

  return {
    handlePeriodChange,
    handleTabChange,
    handleAddCategoryRow,
    handleCategorySelected,
    handleValueChange,
    handleValidateClick,
    handleRemoveRow,
  };
}
