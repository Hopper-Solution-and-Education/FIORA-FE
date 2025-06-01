import { useState } from 'react';
import { BudgetType } from '../../domain/entities/BudgetType';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { getTableDataByPeriod } from '../../utils/transformDataForTable';
import { BudgetDetailFilterType } from '../types/table.type';
import { toast } from 'sonner';

export const useBudgetData = (budgetSummaryUseCase: IBudgetSummaryUseCase) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudgetData = async (year: number, activeTab: BudgetDetailFilterType) => {
    setIsLoading(true);
    try {
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(year, BudgetType.Act),
      ]);

      const mainData = getTableDataByPeriod(top, bot, act, activeTab);
      return mainData.filter((item) => item.key !== 'new-category');
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch budget data');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, fetchBudgetData };
};
