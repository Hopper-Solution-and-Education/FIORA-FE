'use client';

import { COLORS } from '@/shared/constants/chart';
import ComposedChart from './index';
import { ComposedChartDataItem } from './type';

export default function ComposedChartExample() {
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

  const sampleDataWith3Columns: ComposedChartDataItem[] = [
    { name: 2025, expense: 35000, income: 40000, investment: 20000, profit: 40000 },
    { name: 2024, expense: 120000, income: 145000, investment: 50000, profit: 12000 },
    { name: 2023, expense: 120000, income: 145000, investment: 30000, profit: 12000 },
    { name: 2022, expense: 120000, income: 145000, investment: 40000, profit: 12000 },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Biểu đồ với 2 cột</h2>
      <ComposedChart
        data={sampleData}
        title="Composed Chart Example"
        columns={[
          { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
          { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
        ]}
        lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
        currency="VNĐ"
        locale="vi-VN"
        fontSize={{
          title: 18,
          axis: 14,
          tooltip: 14,
          legend: 14,
        }}
      />

      <h2 className="text-xl font-bold mt-8">Biểu đồ với 3 cột</h2>
      <ComposedChart
        data={sampleDataWith3Columns}
        title="Composed Chart với 3 cột"
        columns={[
          { key: 'expense', name: 'Chi phí', color: COLORS.DEPS_DANGER.LEVEL_2 },
          { key: 'income', name: 'Thu nhập', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
          { key: 'investment', name: 'Đầu tư', color: COLORS.DEPS_WARNING.LEVEL_2 },
        ]}
        lines={[{ key: 'profit', name: 'Lợi nhuận', color: COLORS.DEPS_INFO.LEVEL_2 }]}
        currency="VND"
        locale="vi-VN"
        fontSize={{
          title: 18,
          axis: 14,
          tooltip: 14,
          legend: 14,
        }}
      />
    </div>
  );
}
