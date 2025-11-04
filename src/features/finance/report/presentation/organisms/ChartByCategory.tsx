import { ComposedChart, ComposedChartDataItem } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { Currency } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect, useState } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

const ChartByCategory = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const viewChartByCategory = useAppSelector((state) => state.financeControl.viewChartByCategory);
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.settings.currency);
  const [data, setData] = useState<ComposedChartDataItem[]>([]);
  const { getExchangeAmount } = useCurrencyFormatter();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        getFinanceByCategoryAsyncThunk({
          type: FinanceReportEnum.CATEGORY,
          filter: FinanceReportFilterEnum.ALL,
        }),
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(financeByCategory)) {
      const baseCurrency = 'USD';

      const chartData = financeByCategory
        .filter((item) => {
          if (viewChartByCategory === 'income') {
            return item.totalIncome > 0;
          }
          return item.totalExpense > 0;
        })
        .map((item) => {
          // Convert from USD base currency to selected display currency
          const convertedAmount = getExchangeAmount({
            amount: viewChartByCategory === 'income' ? item.totalIncome : item.totalExpense,
            fromCurrency: baseCurrency as Currency,
            toCurrency: currency,
          });

          return {
            name: item.name,
            column: convertedAmount.convertedAmount,
            icon: item.icon ?? 'wallet',
          };
        });

      setData(chartData);
    }
  }, [financeByCategory, viewChartByCategory, currency, getExchangeAmount]);

  return (
    <div className="space-y-8">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ChartSkeleton />
        </div>
      ) : (
        <React.Fragment>
          <ComposedChart
            data={data}
            columns={[
              {
                key: 'column',
                name: viewChartByCategory === 'income' ? 'Income' : 'Expense',
                color:
                  viewChartByCategory === 'income'
                    ? COLORS.DEPS_SUCCESS.LEVEL_2
                    : COLORS.DEPS_DANGER.LEVEL_2,
              },
            ]}
            currency={currency}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default ChartByCategory;
