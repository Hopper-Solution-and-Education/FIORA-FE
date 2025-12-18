import { ComposedChart, ComposedChartDataItem } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { COLORS } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { Currency } from '@/shared/types';
import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

type ChartByDateProps = {
  title?: string;
};

const ChartByDate = ({ title }: ChartByDateProps) => {
  const financeByDate = useAppSelector((state) => state.financeControl.financeByDate);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const [data, setData] = useState<ComposedChartDataItem[]>([]);
  const currency = useAppSelector((state) => state.settings.currency);
  const { getExchangeAmount } = useCurrencyFormatter();

  useEffect(() => {
    const processData = async () => {
      const chartData = await Promise.all(
        financeByDate.map(async (item) => ({
          name: item.period,
          column1: getExchangeAmount({
            amount: item.totalExpense,
            fromCurrency: item.currency as Currency,
            toCurrency: currency,
          }).convertedAmount,

          column2: getExchangeAmount({
            amount: item.totalIncome,
            fromCurrency: item.currency as Currency,
            toCurrency: currency,
          }).convertedAmount,

          line: getExchangeAmount({
            amount: item.totalIncome - item.totalExpense,
            fromCurrency: item.currency as Currency,
            toCurrency: currency,
          }).convertedAmount,
        })),
      );
      setData(chartData);
    };

    if (financeByDate.length > 0) {
      processData();
    }
  }, [financeByDate, getExchangeAmount, currency]);

  return (
    <div className="space-y-8">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ComposedChart
          data={data}
          title={title}
          columns={[
            { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
            { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
          ]}
          lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
          currency={currency}
          sortEnable={false}
        />
      )}
    </div>
  );
};

export default ChartByDate;
