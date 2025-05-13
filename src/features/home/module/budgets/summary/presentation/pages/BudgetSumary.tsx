'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { budgetSummaryDIContainer } from '../../../summary/di/budgetSummaryDIContainer';
import { TYPES } from '../../../summary/di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../../summary/domain/usecases/IBudgetSummaryUseCase';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetType } from '../../domain/entities/BudgetType';
import { transformDataForChart } from '../../utils/transformDataForChart';
import BudgetTreeView from '../molecules/BudgetSummaryTreeView';
import { HierarchicalBarItem } from '../types';

interface BudgetSummaryProps {
  year: number;
}

const BudgetSummary = ({ year: selectedYear }: BudgetSummaryProps) => {
  const [chartData, setChartData] = useState<HierarchicalBarItem[]>([]);
  const [topBudget, setTopBudget] = useState<BudgetSummaryByType | null>(null);
  const [botBudget, setBotBudget] = useState<BudgetSummaryByType | null>(null);
  const [actBudget, setActBudget] = useState<BudgetSummaryByType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { currency } = useAppSelector((state) => state.settings);

  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );

  const handleEditBudget = () => {
    router.push(`/budgets/update/${selectedYear}`);
  };

  const fetchAllBudgetData = async () => {
    setIsLoading(true);

    try {
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Act),
      ]);

      setTopBudget(top);
      setBotBudget(bot);
      setActBudget(act);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget data';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBudgetData();
  }, [selectedYear]);

  useEffect(() => {
    if (topBudget?.budget && botBudget?.budget && actBudget?.budget) {
      const transformedData = transformDataForChart({
        topBudget,
        botBudget,
        actBudget,
        selectedYear,
        currency,
      });

      const addLevelToItems = (items: HierarchicalBarItem[], level = 0): HierarchicalBarItem[] => {
        return items.map((item) => ({
          ...item,
          level,
          children: item.children ? addLevelToItems(item.children, level + 1) : undefined,
        }));
      };

      setChartData(addLevelToItems(transformedData));
    }
  }, [topBudget, botBudget, actBudget, currency, selectedYear]);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Budget Summary</h1>

        <Button type="button" variant="ghost" onClick={handleEditBudget}>
          <Edit color="blue" />
        </Button>
      </div>
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <BudgetTreeView data={chartData} currency={currency || 'USD'} />
      )}
    </div>
  );
};

export default BudgetSummary;
