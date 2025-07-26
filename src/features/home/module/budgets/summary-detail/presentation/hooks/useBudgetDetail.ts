import { useAppSelector } from '@/store';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum, PERIOD_OPTIONS } from '../../data/constants';
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
import { BudgetDetailFilterType } from '../types/table.type';
import { useBudgetDetailDispatchContext } from './useBudgetDetailDispatchContext';
import { useBudgetDetailStateContext } from './useBudgetDetailStateContext';

export function useBudgetDetail(initialYear: number) {
  const { state } = useBudgetDetailStateContext();
  const { dispatch } = useBudgetDetailDispatchContext();
  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );
  const currency = useAppSelector((store) => store.settings.currency) || 'VND';

  // Fetch table data and categories
  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch categories
      const type = state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';
      const categories = await budgetSummaryUseCase.getCategoriesByType(type, initialYear);
      dispatch({ type: 'SET_CATEGORY_LIST', payload: categories });

      // Fetch table data (top, bot, act)
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(initialYear, BudgetType.Act),
      ]);
      // Transform về TableData[]
      let tableData = getTableDataByPeriod(top, bot, act, state.activeTab as 'expense' | 'income');

      // Thêm các category đã isCreated=true vào bảng nếu chưa có
      const createdCategories = categories.filter((cat: Category) => cat.isCreated);
      for (const cat of createdCategories) {
        if (!tableData.some((row) => row.categoryId === cat.id)) {
          tableData.push({
            key: cat.id,
            type: cat.name,
            categoryId: cat.id,
            category: { value: cat.name },
            isParent: true,
            isCreated: true, // Thêm dòng này để phân biệt category đã tạo
            action: true,
            children: [
              {
                key: `${cat.id}-bottom-up`,
                type: 'Bottom Up',
                isChild: true,
                action: true,
                isEditable: true,
                ...transformMonthlyDataToTableFormat((cat.bottomUpPlan as any) || {}),
              },
              {
                key: `${cat.id}-actual`,
                type: 'Actual Sum Up',
                isChild: true,
                action: true,
                isEditable: false,
                ...transformMonthlyDataToTableFormat((cat.actualTransaction as any) || {}),
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
    dispatch({ type: 'SET_ACTIVE_TAB', payload: value });
  };

  // Add/remove category row
  const handleAddCategoryRow = () => {
    const newRowId = `new-category-${Date.now()}`;
    dispatch({ type: 'ADD_EMPTY_CATEGORY_ROW', payload: newRowId });
  };
  const handleRemoveCategoryRow = (rowId: string) => {
    dispatch({ type: 'REMOVE_CATEGORY_ROW', payload: rowId });
  };

  // Set selected categories
  const setSelectedCategories = (categories: Set<string>) => {
    dispatch({ type: 'SET_SELECTED_CATEGORIES', payload: categories });
  };

  // Chọn category cho hàng trống, sẽ sinh 2 dòng con và fetch dữ liệu thực tế
  const handleCategorySelected = async (rowKey: string, category: Category) => {
    dispatch({ type: 'SET_CATEGORY_SELECTED', payload: { rowKey, category } });
    try {
      // Nếu category đã có dữ liệu, hiển thị luôn
      const suffix = state.activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
      const bottomUpData = transformMonthlyDataToTableFormat((category.bottomUpPlan as any) || {});
      const actualData = transformMonthlyDataToTableFormat(
        (category.actualTransaction as any) || {},
      );
      dispatch({
        type: 'SET_CATEGORY_CHILD_DATA',
        payload: {
          rowKey,
          bottomUpData,
          actualData,
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

  // Reset all state
  const resetBudgetDetailState = () => {
    dispatch({ type: 'RESET_BUDGET_DETAIL_STATE' });
  };

  // Thay đổi giá trị ô input (top-down hoặc bottom-up)
  const handleValueChange = (record: any, columnKey: string, value: any) => {
    // Cập nhật lại tableData trong state
    const newTableData = state.tableData.map((item) => {
      if (item.key === record.key) {
        return { ...item, [columnKey]: { value } };
      } else if (item.children) {
        return {
          ...item,
          children: item.children.map((child: any) =>
            child.key === record.key ? { ...child, [columnKey]: { value } } : child,
          ),
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

  const rowLoading = state.rowLoading;
  const setRowLoading = (rowKey: string, loading: boolean) => {
    dispatch({ type: 'SET_ROW_LOADING', payload: { rowKey, loading } });
  };

  const handleValidateClick = async (record: any) => {
    setRowLoading(record.key, true);
    try {
      const tab = state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'expense' : 'income';
      if (record.key === 'top-down') {
        await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: tab === 'expense' ? 'Expense' : 'Income',
          updateTopBudget: transformMonthlyPayload(record, tab as BudgetDetailFilterType),
        });
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
            actualSumUpPlan = transformMonthlyPayload(actualChild, tab as BudgetDetailFilterType);
          }
        }
        await budgetSummaryUseCase.updateCategoryPlanning(
          {
            fiscalYear: initialYear.toString(),
            type: tab === 'expense' ? 'Expense' : 'Income',
            categoryId,
            bottomUpPlan: transformMonthlyPayload(record, tab as BudgetDetailFilterType),
            actualSumUpPlan,
          },
          currency,
        );
        toast.success('Bottom Up updated successfully!');
      }
      await fetchData();
    } catch (err: any) {
      toast.error(err?.message || 'Update failed!');
    } finally {
      setRowLoading(record.key, false);
    }
  };

  // Xử lý nút X cho từng dòng
  const handleRemoveRow = async (record: any) => {
    const tab = state.activeTab === BudgetDetailFilterEnum.EXPENSE ? 'expense' : 'income';
    setRowLoading(record.key, true);
    try {
      if (record.key === 'top-down') {
        // Clear all values về 0
        const zeroPayload: any = {};
        for (let i = 1; i <= 12; i++) zeroPayload[`m${i}_${tab === 'expense' ? 'exp' : 'inc'}`] = 0;
        await budgetSummaryUseCase.updateTopDownPlanning({
          fiscalYear: initialYear.toString(),
          type: tab === 'expense' ? 'Expense' : 'Income',
          updateTopBudget: zeroPayload,
        });
        await fetchData();
        toast.success('Top Down cleared successfully!');
      } else if (record.key.includes('-bottom-up')) {
        // Tìm parent row
        const [categoryId] = record.key.split('-bottom-up');
        const parentItem = state.tableData.find((item) => item.categoryId === categoryId);
        if (parentItem?.isCreated) {
          // Gọi API xóa category
          await budgetSummaryUseCase.deleteCategory({
            fiscalYear: initialYear.toString(),
            type: tab === 'expense' ? 'Expense' : 'Income',
            categoryId,
          });
          await fetchData();
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
    state,
    handlePeriodChange,
    handleTabChange,
    handleAddCategoryRow,
    handleRemoveCategoryRow,
    setSelectedCategories,
    resetBudgetDetailState,
    fetchData,
    handleCategorySelected,
    handleValueChange,
    handleValidateClick,
    handleRemoveRow,
    rowLoading,
    dispatch, // expose dispatch for advanced usage
  };
}
