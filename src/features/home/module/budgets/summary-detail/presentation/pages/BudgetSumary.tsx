/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import { COLORS } from '@/shared/constants/chart';
import { ICON_SIZE } from '@/shared/constants/size';
import { useAppSelector } from '@/store';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { budgetSummaryDIContainer } from '../../di/budgetSummaryDIContainer';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../domain/usecases/IBudgetSummaryUseCase';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetType } from '../../domain/entities/BudgetType';
import { transformDataForChart } from '../../utils/transformDataForChart';
import { convertBudgetCurrency } from '../../utils/convertBudgetCurrency';
import BudgetTreeView from '../molecules/BudgetSummaryTreeView';
import { HierarchicalBarItem } from '../types/chart.type';
import { routeConfig } from '@/shared/utils/route';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import BudgetSummaryYearSelect from '../atoms/BudgetSummaryYearSelect';
import { Currency } from '@/shared/types';

interface BudgetSummaryProps {
  year: number;
}

const BudgetSummary = ({ year: selectedYear }: BudgetSummaryProps) => {
  const [chartData, setChartData] = useState<HierarchicalBarItem[]>([]);
  const [topBudget, setTopBudget] = useState<BudgetSummaryByType | null>(null);
  const [botBudget, setBotBudget] = useState<BudgetSummaryByType | null>(null);
  const [actBudget, setActBudget] = useState<BudgetSummaryByType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currency } = useAppSelector((state) => state.settings);
  const router = useRouter();

  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );

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
    const convertedTop = convertBudgetCurrency(
      topBudget,
      topBudget?.budget.currency as Currency,
      currency,
    );
    const convertedBot = convertBudgetCurrency(
      botBudget,
      botBudget?.budget.currency as Currency,
      currency,
    );
    const convertedAct = convertBudgetCurrency(
      actBudget,
      actBudget?.budget.currency as Currency,
      currency,
    );

    if (convertedTop?.budget && convertedBot?.budget && convertedAct?.budget) {
      const transformedData = transformDataForChart({
        topBudget: convertedTop,
        botBudget: convertedBot,
        actBudget: convertedAct,
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

  const handleEditBudget = () => {
    router.push(routeConfig(RouteEnum.BudgetUpdate, { year: selectedYear.toString() }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <BudgetSummaryYearSelect selectedYear={selectedYear} route={RouteEnum.BudgetSummary} />

        <div className="flex items-center gap-x-3 mr-2">
          <Edit
            className="cursor-pointer scale-100 transition-transform duration-200 hover:scale-125"
            color={COLORS.DEPS_INFO.LEVEL_1}
            size={ICON_SIZE.SM}
            onClick={handleEditBudget}
          />
        </div>
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <BudgetTreeView
          data={chartData}
          currency={currency || 'USD'}
          year={selectedYear.toString()}
        />
      )}
    </div>
  );
};

export default BudgetSummary;
