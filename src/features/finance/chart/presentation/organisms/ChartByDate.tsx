import { ComposedChart, ComposedChartDataItem } from '@/components/common/charts';
import { COLORS } from '@/shared/constants/chart';

const ChartByDate = () => {
  const sampleData: ComposedChartDataItem[] = [
    { name: 2022, column1: 120000, column2: 145000, line: 12000 },
    { name: 2023, column1: 120000, column2: 145000, line: 30000 },
    { name: 2024, column1: 120000, column2: 145000, line: 60000 },
    { name: 2025, column1: 35000, column2: 400000, line: 150000 },
    { name: 2026, column1: 35000, column2: 400000, line: 150000 },
    { name: 2027, column1: 35000, column2: 400000, line: 150000 },
    { name: 2028, column1: 35000, column2: 400000, line: 150000 },
    { name: 2029, column1: 35000, column2: 400000, line: 150000 },
    { name: 2030, column1: 35000, column2: 400000, line: 150000 },
  ];

  return (
    <div className="space-y-8">
      <ComposedChart
        data={sampleData}
        title="Chart by Date"
        columns={[
          { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
          { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
        ]}
        lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
        currency="VNĐ"
      />
    </div>
  );
};

export default ChartByDate;
