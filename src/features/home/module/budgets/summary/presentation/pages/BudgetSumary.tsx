'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import StackedBarChart from '@/components/common/stacked-bar-chart';
import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';
import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';
import { BudgetType, BudgetsTable } from '@prisma/client';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { budgetSummaryDIContainer } from '../../../summary/di/budgetSummaryDIContainer';
import { TYPES } from '../../../summary/di/budgetSummaryDIContainer.type';
import { IBudgetSummaryUseCase } from '../../../summary/domain/usecases/IBudgetSummaryUseCase';
import { useAppSelector } from '@/store';

interface HierarchicalBarItem extends CustomBarItem {
  children?: HierarchicalBarItem[];
  isExpanded?: boolean;
}

// interface BudgetResponse {
//   budget: BudgetsTable;
// }

interface BudgetSummaryProps {
  year: number;
}

const BudgetSummary = ({ year: selectedYear }: BudgetSummaryProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [topBudget, setTopBudget] = useState<any>(null);
  const [botBudget, setBotBudget] = useState<any>(null);
  const [actBudget, setActBudget] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const budgetSummaryUseCase = budgetSummaryDIContainer.get<IBudgetSummaryUseCase>(
    TYPES.IBudgetSummaryUseCase,
  );
  const { currency } = useAppSelector((state) => state.settings);

  const fetchAllBudgetData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [top, bot, act] = await Promise.all([
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Top),
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Bot),
        budgetSummaryUseCase.getBudgetByType(selectedYear, BudgetType.Act),
      ]);

      console.log('Raw API response:', { top, bot, act });

      setTopBudget(top);
      setBotBudget(bot);
      setActBudget(act);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch budget data';
      setError(errorMessage);
      console.error('Error fetching budget data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const transformDataForChart = (): any[] => {
    if (!topBudget?.budget || !botBudget?.budget || !actBudget?.budget) return [];

    const yearData: any = {
      id: 'year',
      name: selectedYear.toString(),
      type: 'year',
      colors: {
        A: COLORS.DEPS_INFO.LEVEL_1, // Actual
        T: COLORS.DEPS_DANGER.LEVEL_1, // Top (Expense)
        B: COLORS.DEPS_SUCCESS.LEVEL_1, // Bot (Income)
      },
      A: actBudget.budget.totalInc || 0,
      T: topBudget.budget.totalInc || 0,
      B: botBudget.budget.totalInc || 0,
      layers: [
        { id: 'A', value: actBudget.budget.totalInc || 0, color: COLORS.DEPS_INFO.LEVEL_1 },
        { id: 'T', value: topBudget.budget.totalInc || 0, color: COLORS.DEPS_DANGER.LEVEL_1 },
        { id: 'B', value: botBudget.budget.totalInc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_1 },
      ],
    };

    const halfYearData: any[] = [
      {
        id: 'half-year-1',
        name: 'First Half Year',
        type: 'half-year',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_2, // Actual
          T: COLORS.DEPS_DANGER.LEVEL_2, // Top (Expense)
          B: COLORS.DEPS_SUCCESS.LEVEL_2, // Bot (Income)
        },
        A: actBudget.budget.h1Inc || 0,
        T: topBudget.budget.h1Inc || 0,
        B: botBudget.budget.h1Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.h1Inc || 0, color: COLORS.DEPS_INFO.LEVEL_2 },
          { id: 'T', value: topBudget.budget.h1Inc || 0, color: COLORS.DEPS_DANGER.LEVEL_2 },
          { id: 'B', value: botBudget.budget.h1Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_2 },
        ],
      },
      {
        id: 'half-year-2',
        name: 'Second Half Year',
        type: 'half-year',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_2, // Actual
          T: COLORS.DEPS_DANGER.LEVEL_2, // Top (Expense)
          B: COLORS.DEPS_SUCCESS.LEVEL_2, // Bot (Income)
        },
        A: actBudget.budget.h2Inc || 0,
        T: topBudget.budget.h2Inc || 0,
        B: botBudget.budget.h2Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.h2Inc || 0, color: COLORS.DEPS_INFO.LEVEL_2 },
          { id: 'T', value: topBudget.budget.h2Inc || 0, color: COLORS.DEPS_DANGER.LEVEL_2 },
          { id: 'B', value: botBudget.budget.h2Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_2 },
        ],
      },
    ];

    const quarterData: any[] = [
      {
        id: 'quarter-1',
        name: 'Quarter 1',
        type: 'quarter',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_3, // Actual
          T: COLORS.DEPS_DANGER.LEVEL_3, // Top (Expense)
          B: COLORS.DEPS_SUCCESS.LEVEL_3, // Bot (Income)
        },
        A: actBudget.budget.q1Inc || 0,
        T: topBudget.budget.q1Inc || 0,
        B: botBudget.budget.q1Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.q1Inc || 0, color: COLORS.DEPS_INFO.LEVEL_3 },
          { id: 'T', value: topBudget.budget.q1Inc || 0, color: COLORS.DEPS_DANGER.LEVEL_3 },
          { id: 'B', value: botBudget.budget.q1Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_3 },
        ],
      },
      {
        id: 'quarter-2',
        name: 'Quarter 2',
        type: 'quarter',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_3,
          T: COLORS.DEPS_DANGER.LEVEL_3, // Thay đổi từ DEPS_WARNING sang DEPS_DANGER
          B: COLORS.DEPS_SUCCESS.LEVEL_3,
        },
        A: actBudget.budget.q2Inc || 0,
        T: topBudget.budget.q2Inc || 0,
        B: botBudget.budget.q2Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.q2Inc || 0, color: COLORS.DEPS_INFO.LEVEL_3 },
          { id: 'T', value: topBudget.budget.q2Inc || 0, color: COLORS.DEPS_DANGER.LEVEL_3 }, // Thay đổi từ DEPS_WARNING sang DEPS_DANGER
          { id: 'E', value: botBudget.budget.q2Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_3 },
        ],
      },
      {
        id: 'quarter-3',
        name: 'Quarter 3',
        type: 'quarter',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_3,
          T: COLORS.DEPS_WARNING.LEVEL_3,
          B: COLORS.DEPS_SUCCESS.LEVEL_3,
        },
        A: actBudget.budget.q3Inc || 0,
        T: topBudget.budget.q3Inc || 0,
        B: botBudget.budget.q3Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.q3Inc || 0, color: COLORS.DEPS_INFO.LEVEL_3 },
          { id: 'T', value: topBudget.budget.q3Inc || 0, color: COLORS.DEPS_WARNING.LEVEL_3 },
          { id: 'B', value: botBudget.budget.q3Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_3 },
        ],
      },
      {
        id: 'quarter-4',
        name: 'Quarter 4',
        type: 'quarter',
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_3,
          T: COLORS.DEPS_WARNING.LEVEL_3,
          B: COLORS.DEPS_SUCCESS.LEVEL_3,
        },
        A: actBudget.budget.q4Inc || 0,
        T: topBudget.budget.q4Inc || 0,
        B: botBudget.budget.q4Inc || 0,
        layers: [
          { id: 'A', value: actBudget.budget.q4Inc || 0, color: COLORS.DEPS_INFO.LEVEL_3 },
          { id: 'T', value: topBudget.budget.q4Inc || 0, color: COLORS.DEPS_WARNING.LEVEL_3 },
          { id: 'B', value: botBudget.budget.q4Inc || 0, color: COLORS.DEPS_SUCCESS.LEVEL_3 },
        ],
      },
    ];

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthFields = [
      'm1Inc',
      'm2Inc',
      'm3Inc',
      'm4Inc',
      'm5Inc',
      'm6Inc',
      'm7Inc',
      'm8Inc',
      'm9Inc',
      'm10Inc',
      'm11Inc',
      'm12Inc',
    ];

    const monthData: any[] = monthFields.map((field, index) => ({
      id: `month-${index + 1}`,
      name: monthNames[index],
      type: 'month',
      colors: {
        A: COLORS.DEPS_INFO.LEVEL_4, // Actual
        T: COLORS.DEPS_DANGER.LEVEL_4, // Top (Expense)
        B: COLORS.DEPS_SUCCESS.LEVEL_4, // Bot (Income)
      },
      A: parseFloat(actBudget.budget[field as keyof BudgetsTable] as string) || 0,
      T: parseFloat(topBudget.budget[field as keyof BudgetsTable] as string) || 0,
      B: parseFloat(botBudget.budget[field as keyof BudgetsTable] as string) || 0,
      layers: [
        {
          id: 'A',
          value: parseFloat(actBudget.budget[field as keyof BudgetsTable] as string) || 0,
          color: COLORS.DEPS_INFO.LEVEL_4,
        },
        {
          id: 'T',
          value: parseFloat(topBudget.budget[field as keyof BudgetsTable] as string) || 0,
          color: COLORS.DEPS_DANGER.LEVEL_4,
        },
        {
          id: 'B',
          value: parseFloat(botBudget.budget[field as keyof BudgetsTable] as string) || 0,
          color: COLORS.DEPS_SUCCESS.LEVEL_4,
        },
      ],
    }));

    halfYearData[0].children = quarterData.slice(0, 2);
    halfYearData[1].children = quarterData.slice(2, 4);

    quarterData[0].children = monthData.slice(0, 3);
    quarterData[1].children = monthData.slice(3, 6);
    quarterData[2].children = monthData.slice(6, 9);
    quarterData[3].children = monthData.slice(9, 12);

    yearData.children = halfYearData;

    console.log('Month Data:', monthData);

    return [yearData];
  };

  const toggleExpand = (id: string) => {
    const toggleItem = (items: HierarchicalBarItem[]): HierarchicalBarItem[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: toggleItem(item.children) };
        }
        return item;
      });
    };
    setChartData(toggleItem(chartData));
  };

  const flattenDataWithIndentation = (items: any[], level: number = 0): any[] => {
    let flattened: HierarchicalBarItem[] = [];
    items.forEach((item) => {
      const indentLevel = level * 10;
      flattened.push({ ...item, indentLevel });
      if (item.isExpanded && item.children) {
        flattened = flattened.concat(flattenDataWithIndentation(item.children, level + 1));
      }
    });
    return flattened;
  };

  useEffect(() => {
    fetchAllBudgetData();
  }, [selectedYear]);

  useEffect(() => {
    console.log('Local state:', { topBudget, botBudget, actBudget });
    if (topBudget?.budget && botBudget?.budget && actBudget?.budget) {
      const transformedData = transformDataForChart();
      const initializeCollapsed = (items: HierarchicalBarItem[]): HierarchicalBarItem[] => {
        return items.map((item) => ({
          ...item,
          isExpanded: false,
          children: item.children ? initializeCollapsed(item.children) : undefined,
        }));
      };
      setChartData(initializeCollapsed(transformedData));
    }
  }, [topBudget, botBudget, actBudget, currency]);

  const flattenedData = flattenDataWithIndentation(chartData);

  console.log('Flattened data:', flattenedData);

  return (
    <div className="p-4">
      {isLoading ? (
        <ChartSkeleton />
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div>
          {flattenedData.map((item) => (
            <div key={item.id} className="relative mb-2">
              <div className="flex items-center">
                <div style={{ paddingLeft: `${item.indentLevel}px` }} className="flex-1">
                  <StackedBarChart
                    data={[item]}
                    title={item.name}
                    currency={currency}
                    onItemClick={() => {}}
                    xAxisFormatter={(value) => formatCurrency(value, currency)}
                    legendItems={[
                      { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
                      { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
                      { name: 'Actual', color: COLORS.DEPS_INFO.LEVEL_1 },
                    ]}
                    tutorialText="Click on a bar to see details"
                  />
                </div>
                {item.children && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="absolute right-0 bottom-0 p-1 text-gray-500 hover:text-gray-700"
                  >
                    {item.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetSummary;
