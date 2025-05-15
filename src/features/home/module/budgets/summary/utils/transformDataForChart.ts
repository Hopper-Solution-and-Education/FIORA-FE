import { COLORS, STACK_TYPE } from '@/shared/constants/chart';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
import { ChartItem, HierarchicalBarItem } from '../presentation/types';
import { Budget } from '../domain/entities/Budget';
import { Currency } from '@/shared/types';
import { convertVNDToUSD } from '@/shared/utils';

interface TransformDataParams {
  topBudget: BudgetSummaryByType | null;
  botBudget: BudgetSummaryByType | null;
  actBudget: BudgetSummaryByType | null;
  selectedYear: number;
  currency: Currency;
}

export const transformDataForChart = ({
  topBudget,
  botBudget,
  actBudget,
  selectedYear,
  currency,
}: TransformDataParams): HierarchicalBarItem[] => {
  if (!topBudget?.budget || !botBudget?.budget || !actBudget?.budget) {
    return [];
  }

  const formatCurrency = (value: number): number => {
    return currency === 'USD' ? convertVNDToUSD(value) : value;
  };

  const getBudgetValue = (budget: Budget, field: string): number => {
    return parseFloat(budget?.[field as keyof typeof budget] as string) || 0;
  };

  // Helper function to map budget data for a given time period
  const mapBudgetForPeriod = (period: string, expField: string, incField: string): ChartItem[] => {
    const actExp = getBudgetValue(actBudget.budget, expField);
    const topExp = getBudgetValue(topBudget.budget, expField);
    const botExp = getBudgetValue(botBudget.budget, expField);

    const actInc = getBudgetValue(actBudget.budget, incField);
    const topInc = getBudgetValue(topBudget.budget, incField);
    const botInc = getBudgetValue(botBudget.budget, incField);

    const actProfit = Math.max(actInc - actExp, 0);
    const topProfit = Math.max(topInc - topExp, 0);
    const botProfit = Math.max(botInc - botExp, 0);

    return [
      {
        name: 'Expense',
        type: STACK_TYPE.EXPENSE,
        icon: 'banknoteArrowDown',
        A: formatCurrency(actExp),
        T: formatCurrency(topExp),
        B: formatCurrency(botExp),
        colors: {
          A: COLORS.DEPS_DANGER.LEVEL_1,
          T: COLORS.DEPS_DANGER.LEVEL_3,
          B: COLORS.DEPS_DANGER.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value: formatCurrency(actExp),
            color: COLORS.DEPS_DANGER.LEVEL_1,
          },
          {
            id: 'T',
            value: formatCurrency(topExp),
            color: COLORS.DEPS_DANGER.LEVEL_3,
          },
          {
            id: 'B',
            value: formatCurrency(botExp),
            color: COLORS.DEPS_DANGER.LEVEL_5,
          },
        ],
      },
      {
        name: 'Income',
        type: STACK_TYPE.INCOME,
        icon: 'banknote',
        A: formatCurrency(actInc),
        T: formatCurrency(topInc),
        B: formatCurrency(botInc),
        colors: {
          A: COLORS.DEPS_SUCCESS.LEVEL_1,
          T: COLORS.DEPS_SUCCESS.LEVEL_3,
          B: COLORS.DEPS_SUCCESS.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value: formatCurrency(actInc),
            color: COLORS.DEPS_SUCCESS.LEVEL_1,
          },
          {
            id: 'T',
            value: formatCurrency(topInc),
            color: COLORS.DEPS_SUCCESS.LEVEL_3,
          },
          {
            id: 'B',
            value: formatCurrency(botInc),
            color: COLORS.DEPS_SUCCESS.LEVEL_5,
          },
        ],
      },
      {
        name: 'Profit',
        type: STACK_TYPE.PROFIT,
        icon: 'handCoins',
        A: formatCurrency(actProfit),
        T: formatCurrency(topProfit),
        B: formatCurrency(botProfit),
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_1,
          T: COLORS.DEPS_INFO.LEVEL_3,
          B: COLORS.DEPS_INFO.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value: formatCurrency(actProfit),
            color: COLORS.DEPS_INFO.LEVEL_1,
          },
          {
            id: 'T',
            value: formatCurrency(topProfit),
            color: COLORS.DEPS_INFO.LEVEL_3,
          },
          {
            id: 'B',
            value: formatCurrency(botProfit),
            color: COLORS.DEPS_INFO.LEVEL_5,
          },
        ],
      },
    ];
  };

  const yearData: HierarchicalBarItem = {
    id: 'year',
    name: selectedYear.toString(),
    type: STACK_TYPE.EXPENSE,
    data: mapBudgetForPeriod('year', 'totalExp', 'totalInc'),
  };

  const halfYearData: HierarchicalBarItem[] = [
    {
      id: 'half-year-1',
      name: 'First Half Year',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('half-year-1', 'h1Exp', 'h1Inc'),
    },
    {
      id: 'half-year-2',
      name: 'Second Half Year',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('half-year-2', 'h2Exp', 'h2Inc'),
    },
  ];

  const quarterData: HierarchicalBarItem[] = [
    {
      id: 'quarter-1',
      name: 'Quarter 1',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('quarter-1', 'q1Exp', 'q1Inc'),
    },
    {
      id: 'quarter-2',
      name: 'Quarter 2',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('quarter-2', 'q2Exp', 'q2Inc'),
    },
    {
      id: 'quarter-3',
      name: 'Quarter 3',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('quarter-3', 'q3Exp', 'q3Inc'),
    },
    {
      id: 'quarter-4',
      name: 'Quarter 4',
      type: STACK_TYPE.EXPENSE,
      data: mapBudgetForPeriod('quarter-4', 'q4Exp', 'q4Inc'),
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
  const monthFieldsExp = [
    'm1Exp',
    'm2Exp',
    'm3Exp',
    'm4Exp',
    'm5Exp',
    'm6Exp',
    'm7Exp',
    'm8Exp',
    'm9Exp',
    'm10Exp',
    'm11Exp',
    'm12Exp',
  ];
  const monthFieldsInc = [
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

  const monthData: HierarchicalBarItem[] = monthFieldsExp.map((expField, index) => ({
    id: `month-${index + 1}`,
    name: monthNames[index],
    type: STACK_TYPE.EXPENSE,
    data: mapBudgetForPeriod(`month-${index + 1}`, expField, monthFieldsInc[index]),
  }));

  halfYearData[0].children = quarterData.slice(0, 2);
  halfYearData[1].children = quarterData.slice(2, 4);

  quarterData[0].children = monthData.slice(0, 3);
  quarterData[1].children = monthData.slice(3, 6);
  quarterData[2].children = monthData.slice(6, 9);
  quarterData[3].children = monthData.slice(9, 12);

  yearData.children = halfYearData;

  return [yearData];
};
