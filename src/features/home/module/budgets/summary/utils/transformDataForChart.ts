import { COLORS, STACK_TYPE } from '@/shared/constants/chart';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';

interface TransformDataParams {
  topBudget: BudgetSummaryByType | null;
  botBudget: BudgetSummaryByType | null;
  actBudget: BudgetSummaryByType | null;
  selectedYear: number;
}

export const transformDataForChart = ({
  topBudget,
  botBudget,
  actBudget,
  selectedYear,
}: TransformDataParams): CustomBarItem[] => {
  if (!topBudget?.budget || !botBudget?.budget || !actBudget?.budget) {
    return [];
  }

  // Helper function to map budget data for a given time period
  const mapBudgetForPeriod = (period: string, expField: string, incField: string): any[] => {
    return [
      {
        name: 'Expense',
        type: STACK_TYPE.EXPENSE,
        icon: 'banknoteArrowDown',
        A: parseFloat(actBudget.budget[expField]) || 0,
        T: parseFloat(topBudget.budget[expField]) || 0,
        B: parseFloat(botBudget.budget[expField]) || 0,
        colors: {
          A: COLORS.DEPS_DANGER.LEVEL_1,
          T: COLORS.DEPS_DANGER.LEVEL_3,
          B: COLORS.DEPS_DANGER.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value: parseFloat(actBudget.budget[expField]) || 0,
            color: COLORS.DEPS_DANGER.LEVEL_1,
          },
          {
            id: 'T',
            value: parseFloat(topBudget.budget[expField]) || 0,
            color: COLORS.DEPS_DANGER.LEVEL_3,
          },
          {
            id: 'B',
            value: parseFloat(botBudget.budget[expField]) || 0,
            color: COLORS.DEPS_DANGER.LEVEL_5,
          },
        ],
      },
      {
        name: 'Income',
        type: STACK_TYPE.INCOME,
        icon: 'banknote',
        A: parseFloat(actBudget.budget[incField]) || 0,
        T: parseFloat(topBudget.budget[incField]) || 0,
        B: parseFloat(botBudget.budget[incField]) || 0,
        colors: {
          A: COLORS.DEPS_SUCCESS.LEVEL_1,
          T: COLORS.DEPS_SUCCESS.LEVEL_3,
          B: COLORS.DEPS_SUCCESS.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value: parseFloat(actBudget.budget[incField]) || 0,
            color: COLORS.DEPS_SUCCESS.LEVEL_1,
          },
          {
            id: 'T',
            value: parseFloat(topBudget.budget[incField]) || 0,
            color: COLORS.DEPS_SUCCESS.LEVEL_3,
          },
          {
            id: 'B',
            value: parseFloat(botBudget.budget[incField]) || 0,
            color: COLORS.DEPS_SUCCESS.LEVEL_5,
          },
        ],
      },
      {
        name: 'Profit',
        type: STACK_TYPE.PROFIT,
        icon: 'handCoins',
        A:
          Math.max(
            parseFloat(actBudget.budget[incField]) - parseFloat(actBudget.budget[expField]),
            0,
          ) || 0,
        T:
          Math.max(
            parseFloat(topBudget.budget[incField]) - parseFloat(topBudget.budget[expField]),
            0,
          ) || 0,
        B:
          Math.max(
            parseFloat(botBudget.budget[incField]) - parseFloat(botBudget.budget[expField]),
            0,
          ) || 0,
        colors: {
          A: COLORS.DEPS_INFO.LEVEL_1,
          T: COLORS.DEPS_INFO.LEVEL_3,
          B: COLORS.DEPS_INFO.LEVEL_5,
        },
        layers: [
          {
            id: 'A',
            value:
              Math.max(
                parseFloat(actBudget.budget[incField]) - parseFloat(actBudget.budget[expField]),
                0,
              ) || 0,
            color: COLORS.DEPS_INFO.LEVEL_1,
          },
          {
            id: 'T',
            value:
              Math.max(
                parseFloat(topBudget.budget[incField]) - parseFloat(topBudget.budget[expField]),
                0,
              ) || 0,
            color: COLORS.DEPS_INFO.LEVEL_3,
          },
          {
            id: 'B',
            value:
              Math.max(
                parseFloat(botBudget.budget[incField]) - parseFloat(botBudget.budget[expField]),
                0,
              ) || 0,
            color: COLORS.DEPS_INFO.LEVEL_5,
          },
        ],
      },
    ];
  };

  const yearData: any = {
    id: 'year',
    name: selectedYear.toString(),
    type: 'year',
    data: mapBudgetForPeriod('year', 'totalExp', 'totalInc'),
  };

  const halfYearData: any[] = [
    {
      id: 'half-year-1',
      name: 'First Half Year',
      type: 'half-year',
      data: mapBudgetForPeriod('half-year-1', 'h1Exp', 'h1Inc'),
    },
    {
      id: 'half-year-2',
      name: 'Second Half Year',
      type: 'half-year',
      data: mapBudgetForPeriod('half-year-2', 'h2Exp', 'h2Inc'),
    },
  ];

  const quarterData: any[] = [
    {
      id: 'quarter-1',
      name: 'Quarter 1',
      type: 'quarter',
      data: mapBudgetForPeriod('quarter-1', 'q1Exp', 'q1Inc'),
    },
    {
      id: 'quarter-2',
      name: 'Quarter 2',
      type: 'quarter',
      data: mapBudgetForPeriod('quarter-2', 'q2Exp', 'q2Inc'),
    },
    {
      id: 'quarter-3',
      name: 'Quarter 3',
      type: 'quarter',
      data: mapBudgetForPeriod('quarter-3', 'q3Exp', 'q3Inc'),
    },
    {
      id: 'quarter-4',
      name: 'Quarter 4',
      type: 'quarter',
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

  const monthData: any[] = monthFieldsExp.map((expField, index) => ({
    id: `month-${index + 1}`,
    name: monthNames[index],
    type: 'month',
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
