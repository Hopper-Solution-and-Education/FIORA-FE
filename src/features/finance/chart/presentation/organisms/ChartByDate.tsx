import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { COLORS } from '@/shared/constants/chart';
import { Currency } from '@/shared/types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { useAppSelector } from '@/store';

const ChartByDate = () => {
  const financeByDate = useAppSelector((state) => state.financeControl.financeByDate);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const currency = useAppSelector((state) => state.settings.currency);

  const data = financeByDate.map((item) => ({
    name: item.period,
    column1: convertCurrency(item.totalExpense, item.currency as Currency, currency),
    column2: convertCurrency(item.totalIncome, item.currency as Currency, currency),
    line: convertCurrency(
      item.totalIncome - item.totalExpense,
      item.currency as Currency,
      currency,
    ),
  }));

  return (
    <div className="space-y-8">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ComposedChart
          data={data}
          columns={[
            { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
            { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
          ]}
          lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
          currency={currency}
        />
      )}
    </div>
  );
};

export default ChartByDate;
