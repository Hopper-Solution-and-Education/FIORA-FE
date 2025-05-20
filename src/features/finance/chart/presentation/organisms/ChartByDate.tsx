import { ComposedChart } from '@/components/common/charts';
import { COLORS } from '@/shared/constants/chart';
import { useAppSelector } from '@/store';

const ChartByDate = () => {
  const financeByDate = useAppSelector((state) => state.financeControl.financeByDate);

  const data = financeByDate.map((item) => ({
    name: item.period,
    column1: item.totalExpense,
    column2: item.totalIncome,
    line: item.totalIncome - item.totalExpense,
  }));

  return (
    <div className="space-y-8">
      <ComposedChart
        data={data}
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
