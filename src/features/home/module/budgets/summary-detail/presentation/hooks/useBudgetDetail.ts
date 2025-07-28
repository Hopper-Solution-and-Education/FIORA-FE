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
  addOriginalDataToRowData,
  addOriginalDataToTableData,
  convertBudgetToMonthlyData,
  createChildData,
  getTabSuffix,
  getTabType,
} from '../../utils/details/compareDataForTable';
import {
  transformMonthlyDataToTableFormat,
  transformMonthlyPayload,
} from '../../utils/details/dataTransformations';
import { getTableDataByPeriod } from '../../utils/details/transformDataForTable';
import { BudgetDetailFilterType, TableData, TableRowData } from '../types/table.type';
import { useBudgetDetailDispatchContext } from './useBudgetDetailDispatchContext';
import { useBudgetDetailStateContext } from './useBudgetDetailStateContext';

/**
 * Main hook for managing budget detail functionality
 * Handles data fetching, state management, and user interactions for budget planning
 * @param initialYear - The fiscal year to load budget data for
 *
 * Please run below test after update this hook
 * @test To run tests for this hook:
 * pnpm test src/features/home/module/budgets/summary-detail/presentation/hooks/__test__/useBudgetDetail.test.ts --coverage=false
 * pnpm test -- --testPathPattern=src/features/home/module/budgets/summary-detail/presentation/hooks/__test__/useBudgetDetail.test.ts --coverage=false
 * pnpm run test:watch -- --testPathPattern=src/features/home/module/budgets/summary-detail/presentation/hooks/__test__/useBudgetDetail.test.ts --coverage=false
 */
export function useBudgetDetail(initialYear: number) {
  const { state } = useBudgetDetailStateContext();
  const { dispatch } = useBudgetDetailDispatchContext();

  // Get currency from global settings
  const currency = useAppSelector((store) => store.settings.currency);

  // Memoize budgetSummaryUseCase to prevent unnecessary re-creation
  const budgetSummaryUseCase = useMemo(
    () => budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase),
    [],
  );

  /**
   * Fetches and transforms budget data for display in the table
   * Includes categories, top-down, bottom-up, and actual budget data
   */
  const fetchData = useCallback(async (tab: string, year: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch categories based on current active tab (expense/income)
      const type = getTabType(tab as BudgetDetailFilterType);
      const categories = await budgetSummaryUseCase.getCategoriesByType(type, year);
      dispatch({ type: 'SET_CATEGORY_LIST', payload: categories });

      // Fetch all budget data types in parallel for better performance
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Act),
      ]);

      // Transform raw budget data into table format
      let tableData = getTableDataByPeriod(top, bot, act, tab as BudgetDetailFilterType);

      // Add original data tracking to all records for change detection
      tableData = tableData.map(addOriginalDataToTableData);

      // Add existing created categories to the table if not already present
      const createdCategories = categories.filter((cat: Category) => cat.isCreated);
      for (const cat of createdCategories) {
        if (!tableData.some((row) => row.categoryId === cat.id)) {
          // Transform category's bottom-up and actual data for table display
          const bottomUpData = transformMonthlyDataToTableFormat(
            (cat.bottomUpPlan as MonthlyPlanningData) || {},
          );
          const actualData = transformMonthlyDataToTableFormat(
            (cat.actualTransaction as MonthlyPlanningData) || {},
          );

          // Create parent category row with child rows for bottom-up and actual data
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
              createChildData(`${cat.id}-bottom-up`, 'Bottom Up', bottomUpData, true),
              createChildData(`${cat.id}-actual`, 'Actual Sum Up', actualData, false),
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
  }, []);

  // Fetch data on mount or when year/tab/period changes
  useEffect(() => {
    fetchData(state.activeTab, initialYear);
  }, [fetchData, state.activeTab, initialYear]);

  // Automatically add an empty category row when only default rows exist
  useEffect(() => {
    if (state.tableData.length === 3) {
      handleAddCategoryRow();
    }
  }, [state.tableData.length]);

  /**
   * Handles period change (month/quarter/half-year/year)
   * Updates the period state and triggers data refetch
   */
  const handlePeriodChange = (value: string) => {
    const option = PERIOD_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      dispatch({ type: 'SET_PERIOD', payload: option.period });
      dispatch({ type: 'SET_PERIOD_ID', payload: value });
    }
  };

  /**
   * Handles tab change between expense and income
   * Updates the active tab and triggers data refetch
   */
  const handleTabChange = (value: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: value as BudgetDetailFilterType });
  };

  /**
   * Adds a new empty category row for user to select a category
   * Generates a unique key for the new row
   */
  const handleAddCategoryRow = () => {
    const newRowId = `new-category-${Date.now()}`;
    dispatch({ type: 'ADD_EMPTY_CATEGORY_ROW', payload: newRowId });
  };

  /**
   * Handles category selection for empty rows
   * Creates child rows (Bottom Up and Actual Sum Up) with category data
   * @param rowKey - The key of the row where category was selected
   * @param category - The selected category object
   */
  const handleCategorySelected = async (rowKey: string, category: Category) => {
    dispatch({ type: 'SET_CATEGORY_SELECTED', payload: { rowKey, category } });
    try {
      // Transform category's existing data for immediate display
      const bottomUpData = transformMonthlyDataToTableFormat(
        (category.bottomUpPlan as MonthlyPlanningData) || {},
      );
      const actualData = transformMonthlyDataToTableFormat(
        (category.actualTransaction as MonthlyPlanningData) || {},
      );

      // Add original data tracking to the transformed data
      const bottomUpWithOriginal = addOriginalDataToRowData(bottomUpData);
      const actualWithOriginal = addOriginalDataToRowData(actualData);

      // Update the table with the new category data
      dispatch({
        type: 'SET_CATEGORY_CHILD_DATA',
        payload: {
          rowKey,
          bottomUpData: bottomUpWithOriginal,
          actualData: actualWithOriginal,
        },
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch budget detail data');
    }
  };

  /**
   * Handles value changes in editable cells
   * Updates the table data and tracks changes for validation
   * @param record - The table row record being modified
   * @param columnKey - The column key being changed
   * @param value - The new value
   */
  const handleValueChange = (record: TableData, columnKey: string, value: number) => {
    // Update table data in state
    const newTableData = state.tableData.map((item) => {
      if (item.key === record.key) {
        // Check if value has changed from original for change tracking
        const originalValue = item.originalData?.[columnKey]?.value;
        const hasChanges = originalValue !== value;
        return { ...item, [columnKey]: { value }, hasChanges };
      } else if (item.children) {
        // Handle changes in child rows
        return {
          ...item,
          children: item.children.map((child: TableData) => {
            if (child.key === record.key) {
              // Check if value has changed from original for change tracking
              const originalValue = child.originalData?.[columnKey]?.value;
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

  /**
   * Sets loading state for specific rows during API operations
   * @param rowKey - The key of the row to set loading for
   * @param loading - Whether the row is loading
   */
  const setRowLoading = (rowKey: string, loading: boolean) => {
    dispatch({ type: 'SET_ROW_LOADING', payload: { rowKey, loading } });
  };

  /**
   * Handles validation/save button clicks
   * Updates budget data via API and refreshes the table
   * @param record - The table row record to validate/save
   */
  const handleValidateClick = async (record: TableData) => {
    setRowLoading(record.key, true);
    try {
      const tabType = getTabType(state.activeTab);

      if (record.key === 'top-down') {
        // Update top-down budget planning
        const updatedTopDown = await budgetSummaryUseCase.updateTopDownPlanning(
          {
            fiscalYear: initialYear.toString(),
            type: tabType,
            updateTopBudget: transformMonthlyPayload(record, state.activeTab),
          },
          currency,
        );

        // Convert updated budget back to table format
        const monthlyData = convertBudgetToMonthlyData(updatedTopDown, state.activeTab);

        // Update the top-down row with new data and reset change tracking
        const newTableData = state.tableData.map((item) => {
          if (item.key === 'top-down') {
            const updatedData = transformMonthlyDataToTableFormat(monthlyData);
            // Update original data and reset change tracking
            const originalData: TableRowData = {};
            Object.keys(updatedData).forEach((key) => {
              if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== null) {
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
        // Handle bottom-up category planning updates
        const [categoryId] = record.key.split('-bottom-up');

        // Get actual sum-up plan from the actual child row if it exists
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

        // Update category planning via API
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

        // Convert API response back to monthly data format for bottom-up
        const bottomUpMonthlyData: MonthlyPlanningData = {};

        updatedCategoryData.updatedBudgetDetails.forEach((detail) => {
          if (detail && detail.month !== null && detail.amount !== null) {
            const monthKey =
              `m${detail.month}_${state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'exp' : 'inc'}` as keyof MonthlyPlanningData;
            bottomUpMonthlyData[monthKey] = Number(detail.amount);
          }
        });

        // Convert API response back to monthly data format for actual
        const actualMonthlyData: MonthlyPlanningData = {};

        updatedCategoryData.actBudgetDetails.forEach((detail) => {
          if (detail && detail.month !== null && detail.amount !== null) {
            const monthKey =
              `m${detail.month}_${state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'exp' : 'inc'}` as keyof MonthlyPlanningData;
            actualMonthlyData[monthKey] = Number(detail.amount);
          }
        });

        // Convert bottom-up budget to monthly data for the bottom budget row
        const bottomBudgetMonthlyData = convertBudgetToMonthlyData(
          updatedCategoryData.bottomUpBudget.budget,
          state.activeTab,
        );

        // Update all affected rows with new data
        const newTableData = state.tableData.map((item) => {
          if (item.categoryId === categoryId && item.children) {
            return {
              ...item,
              isCreated: true, // Mark category as created after successful update
              children: item.children.map((child) => {
                if (child.key === `${categoryId}-bottom-up`) {
                  const updatedData = transformMonthlyDataToTableFormat(bottomUpMonthlyData);
                  // Update original data and reset change tracking
                  const originalData: TableRowData = {};
                  Object.keys(updatedData).forEach((key) => {
                    if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== null) {
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
                  // Update original data and reset change tracking
                  const originalData: TableRowData = {};
                  Object.keys(updatedData).forEach((key) => {
                    if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== null) {
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
          // Update bottom budget row with new aggregated data
          if (item.key === 'bottom-up') {
            const updatedData = transformMonthlyDataToTableFormat(bottomBudgetMonthlyData);
            // Update original data and reset change tracking
            const originalData: TableRowData = {};

            Object.keys(updatedData).forEach((key) => {
              if (typeof updatedData[key] === 'object' && updatedData[key]?.value !== null) {
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

  /**
   * Handles remove/clear button clicks (X button)
   * For top-down: clears all values to zero
   * For categories: deletes created categories or removes new categories locally
   * @param record - The table row record to remove/clear
   */
  const handleRemoveRow = async (record: TableData) => {
    const tabType = getTabType(state.activeTab);
    setRowLoading(record.key, true);
    try {
      if (record.key === 'top-down') {
        // Clear all top-down values to zero
        const suffix = getTabSuffix(state.activeTab);

        const zeroPayload: MonthlyPlanningData = Object.fromEntries(
          Array.from({ length: 12 }, (_, i) => {
            const key = `m${i + 1}${suffix}` as keyof MonthlyPlanningData;
            return [key, 0];
          }),
        );

        // Update top-down with zero values via API
        const clearedTopDown = await budgetSummaryUseCase.updateTopDownPlanning(
          {
            fiscalYear: initialYear.toString(),
            type: tabType,
            updateTopBudget: zeroPayload,
          },
          currency,
        );

        // Convert cleared budget back to table format and update the row
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
        // Handle category removal/clear
        const [categoryId] = record.key.split('-bottom-up');
        const parentItem = state.tableData.find((item) => item.categoryId === categoryId);

        if (parentItem?.isCreated) {
          // Delete created category via API
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
          // Remove new category locally (not yet created)
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

  /**
   * Toggle table expand/collapse state
   */
  const handleToggleExpand = useCallback(() => {
    dispatch({ type: 'SET_EXPAND', payload: !state.expand });
  }, [dispatch, state.expand]);

  // Return all handlers and state for component consumption
  return {
    fetchData,
    handlePeriodChange,
    handleTabChange,
    handleAddCategoryRow,
    handleCategorySelected,
    handleValueChange,
    setRowLoading,
    handleValidateClick,
    handleRemoveRow,
    handleToggleExpand,
  };
}
