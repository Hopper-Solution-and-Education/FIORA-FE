import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { useAppDispatch } from '@/store';
import {
  clearCategoryListSlice,
  clearTableDataSlice,
  setCategoryListSlice,
  setTableDataSlice,
} from '@/store/slices/budget-detail.slice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { BudgetDetailFilterType, BudgetInit, TableData } from '../types/table.type';
import { useBudgetData } from './useBudgetData';

interface UseBudgetInitProps {
  initialYear: number;
  activeTab: BudgetDetailFilterType;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
}

export function useBudgetInit({
  initialYear,
  activeTab,
  budgetSummaryUseCase,
}: UseBudgetInitProps) {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { isLoading, fetchBudgetData } = useBudgetData(budgetSummaryUseCase);

  const loadData = async () => {
    try {
      const data = await fetchBudgetData(initialYear, activeTab);

      setTableData(data || []);
      dispatch(setTableDataSlice(data || []));
    } catch (err) {
      dispatch(clearTableDataSlice());
      toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
      router.push(routeConfig(RouteEnum.Budgets));
    }
  };

  const fetchCategories = async () => {
    try {
      const type = activeTab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';
      const response = await budgetSummaryUseCase.getCategoriesByType(type, initialYear);

      setCategoryList(response);
      dispatch(setCategoryListSlice(response));
    } catch (err: any) {
      dispatch(clearCategoryListSlice());
      toast.error(err?.message || 'Failed to fetch categories');
    }
  };

  return {
    isLoading,
    table: {
      data: tableData,
      set: setTableData,
      fetch: loadData,
    } as BudgetInit<TableData>,
    categories: {
      data: categoryList,
      set: setCategoryList,
      fetch: fetchCategories,
    } as BudgetInit<Category>,
  };
}
