import ComposedChartComponent from '@/components/common/charts/composed-chart';
import { COLORS } from '@/shared/constants/chart';
import { ComposedChartDataItem } from './type';

export const ComposedChartExample = () => {
  const data: ComposedChartDataItem[] = [
    { name: 'Tháng 1sdafffffffffffffffffffffffffffff', expense: 4000, income: 24400, profit: 1600 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    // { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    // { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    // { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
    // { name: 'Tháng 7adsssssssssssssssssssssssssss', expense: 3490, income: -23000, profit: -1190 },
  ];

  return (
    <ComposedChartComponent
      data={data}
      title="Biểu đồ Doanh thu và Chi phí"
      currency="VND"
      columns={[
        { key: 'expense', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
        { key: 'income', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
      ]}
      lines={[{ key: 'profit', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_1 }]}
    />
  );
};
