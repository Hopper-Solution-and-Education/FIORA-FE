import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { BudgetDetailFilterType, TableData } from '../types/table.type';
import { useBudgetData } from './useBudgetData';

interface UseBudgetInitProps {
  initialYear: number;
  activeTab: BudgetDetailFilterType;
  budgetSummaryUseCase: IBudgetSummaryUseCase;
  setTableData: React.Dispatch<React.SetStateAction<TableData[]>>;
}

export function useBudgetInit({
  initialYear,
  activeTab,
  budgetSummaryUseCase,
  setTableData,
}: UseBudgetInitProps) {
  const router = useRouter();
  const { isLoading, fetchBudgetData } = useBudgetData(budgetSummaryUseCase);

  const loadData = async () => {
    try {
      const data = await fetchBudgetData(initialYear, activeTab);

      if (data && data.length > 0) {
        setTableData((prevData) => {
          const firstThreeRows = data.slice(0, 3);
          const remainingRows = prevData.slice(3);

          return [...firstThreeRows, ...remainingRows];
        });
      } else {
        setTableData([]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch budget data');
      router.push(routeConfig(RouteEnum.Budgets));
    }
  };

  return {
    isLoading,
    loadData,
  };
}
