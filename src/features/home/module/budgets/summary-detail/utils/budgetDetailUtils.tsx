import { InputCurrency } from '@/components/common/forms';
import { Icons } from '@/components/Icon';
import { Currency } from '@/shared/types';
import { convertVNDToUSD } from '@/shared/utils';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';

export interface TableData {
  key: string;
  type: string;
  jan?: number;
  feb?: number;
  mar?: number;
  q1?: number;
  apr?: number;
  may?: number;
  jun?: number;
  q2?: number;
  h1?: number;
  jul?: number;
  aug?: number;
  sep?: number;
  q3?: number;
  oct?: number;
  nov?: number;
  dec?: number;
  q4?: number;
  h2?: number;
  fullYear?: number;
  action?: boolean;
  children?: TableData[];
  isParent?: boolean;
  isChild?: boolean;
}

export const BudgetDetailType = {
  MONTH: 'month',
  QUARTER: 'quarter',
  HALF_YEAR: 'half-year',
  YEAR: 'year',
};

// Hàm format giá trị tiền tệ
export const formatCurrencyValue = (value: number, currency: Currency): string => {
  const formattedValue = currency === 'USD' ? convertVNDToUSD(value) : value;
  return formattedValue.toLocaleString();
};

// Hàm lấy giá trị từ budget
export const getBudgetValue = (budget: BudgetSummaryByType | null, field: string): number => {
  if (!budget?.budget) return 0;
  const value = parseFloat(budget.budget[field as keyof typeof budget.budget] as string);
  return isNaN(value) ? 0 : value;
};

// Hàm tổng hợp dữ liệu cho một kỳ
export const aggregateForPeriod = (
  budget: BudgetSummaryByType | null,
): { [key: string]: number } => {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  const data: { [key: string]: number } = {};

  months.forEach((month, index) => {
    const expField = `m${index + 1}Exp`;
    const incField = `m${index + 1}Inc`;
    data[month] = getBudgetValue(budget, expField) + getBudgetValue(budget, incField);
  });

  data['q1'] = data['jan'] + data['feb'] + data['mar'];
  data['q2'] = data['apr'] + data['may'] + data['jun'];
  data['q3'] = data['jul'] + data['aug'] + data['sep'];
  data['q4'] = data['oct'] + data['nov'] + data['dec'];
  data['h1'] = data['q1'] + data['q2'];
  data['h2'] = data['q3'] + data['q4'];
  data['fullYear'] = data['h1'] + data['h2'];

  return data;
};

// Hàm lấy dữ liệu cho bảng dựa trên loại kỳ
export const getTableDataByPeriod = (
  top: BudgetSummaryByType | null,
  bot: BudgetSummaryByType | null,
  act: BudgetSummaryByType | null,
): TableData[] => {
  const topData = aggregateForPeriod(top);
  const botData = aggregateForPeriod(bot);
  const actData = aggregateForPeriod(act);

  const data: TableData[] = [
    { key: 'top-down', type: 'Total Top Down', ...topData, action: true } as TableData,
    { key: 'bottom-up', type: 'Total Bottom Up', ...botData, action: true } as TableData,
    { key: 'actual', type: 'Total Actual Sum Up', ...actData, action: true } as TableData,
  ];

  return data;
};

// Hàm lấy các cột hiển thị dựa trên loại kỳ
export const getColumnsByPeriod = (period: string, periodId: string, currency: Currency) => {
  // Cột mặc định luôn hiển thị
  const defaultColumns = [
    {
      key: 'type',
      dataIndex: 'type',
      title: 'Type',
      width: 200,
      align: 'left' as const,
      fixed: 'left',
    },
  ];

  // Cột action luôn hiển thị ở cuối
  const actionColumn = {
    key: 'action',
    dataIndex: 'action',
    title: 'ACTION',
    width: 120,
    align: 'center' as const,
    fixed: 'right' as const,
    render: (value: boolean) =>
      value ? (
        <div className="grid grid-flow-col place-items-center gap-2">
          <span className="text-red-500 hover:text-red-700 cursor-pointer" title="Invalid">
            <Icons.close size={15} />
          </span>
          <span className="text-green-500 hover:text-green-700 cursor-pointer" title="Valid">
            <Icons.check size={15} />
          </span>
        </div>
      ) : null,
  };

  // Các cột tháng
  const monthColumns = [
    {
      key: 'jan',
      dataIndex: 'jan',
      title: 'Jan',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="jan" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'feb',
      dataIndex: 'feb',
      title: 'Feb',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="feb" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'mar',
      dataIndex: 'mar',
      title: 'Mar',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="mar" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'apr',
      dataIndex: 'apr',
      title: 'Apr',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="apr" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'may',
      dataIndex: 'may',
      title: 'May',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="may" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'jun',
      dataIndex: 'jun',
      title: 'Jun',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="jun" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'jul',
      dataIndex: 'jul',
      title: 'Jul',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="jul" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'aug',
      dataIndex: 'aug',
      title: 'Aug',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="aug" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'sep',
      dataIndex: 'sep',
      title: 'Sep',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="sep" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'oct',
      dataIndex: 'oct',
      title: 'Oct',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="oct" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'nov',
      dataIndex: 'nov',
      title: 'Nov',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="nov" value={value} currency={currency} classContainer="m-0" />
      ),
    },
    {
      key: 'dec',
      dataIndex: 'dec',
      title: 'Dec',
      width: 120,
      align: 'center' as const,
      render: (value: number) => (
        <InputCurrency name="dec" value={value} currency={currency} classContainer="m-0" />
      ),
    },
  ];

  // Các cột quý
  const quarterColumns = [
    {
      key: 'q1',
      dataIndex: 'q1',
      title: 'Q1',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
    {
      key: 'q2',
      dataIndex: 'q2',
      title: 'Q2',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
    {
      key: 'q3',
      dataIndex: 'q3',
      title: 'Q3',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
    {
      key: 'q4',
      dataIndex: 'q4',
      title: 'Q4',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
  ];

  // Các cột nửa năm
  const halfYearColumns = [
    {
      key: 'h1',
      dataIndex: 'h1',
      title: 'H1',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
    {
      key: 'h2',
      dataIndex: 'h2',
      title: 'H2',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
  ];

  // Cột cả năm
  const fullYearColumn = [
    {
      key: 'fullYear',
      dataIndex: 'fullYear',
      title: 'Full Year',
      width: 120,
      align: 'center' as const,
      render: (value: number) => formatCurrencyValue(value, currency),
    },
  ];

  // Xác định các cột hiển thị dựa trên loại kỳ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let periodColumns: any = [];

  switch (period) {
    case BudgetDetailType.MONTH: {
      // Nếu là tháng, chỉ hiển thị tháng đó
      const monthIndex = parseInt(periodId.split('-')[1]) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        periodColumns = [monthColumns[monthIndex]];
      }
      break;
    }

    case BudgetDetailType.QUARTER: {
      // Nếu là quý, hiển thị 3 tháng của quý đó và tổng quý
      const quarterIndex = parseInt(periodId.split('-')[1]) - 1;
      if (quarterIndex >= 0 && quarterIndex < 4) {
        const startMonthIndex = quarterIndex * 3;
        periodColumns = [
          monthColumns[startMonthIndex],
          monthColumns[startMonthIndex + 1],
          monthColumns[startMonthIndex + 2],
          quarterColumns[quarterIndex],
        ];
      }
      break;
    }

    case BudgetDetailType.HALF_YEAR: {
      // Nếu là nửa năm, hiển thị 2 quý và tổng nửa năm
      const halfYearIndex = parseInt(periodId.split('-')[1]) - 1;
      if (halfYearIndex >= 0 && halfYearIndex < 2) {
        const startQuarterIndex = halfYearIndex * 2;
        periodColumns = [
          quarterColumns[startQuarterIndex],
          quarterColumns[startQuarterIndex + 1],
          halfYearColumns[halfYearIndex],
        ];
      }
      break;
    }

    case BudgetDetailType.YEAR:
    default: {
      // Nếu là cả năm hoặc mặc định, hiển thị tất cả
      periodColumns = [...monthColumns, ...quarterColumns, ...halfYearColumns, ...fullYearColumn];
      break;
    }
  }

  return [...defaultColumns, ...periodColumns, actionColumn];
};
