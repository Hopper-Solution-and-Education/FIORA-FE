import { ComposedChart } from '@/components/common/charts';
import { renderIconOrImage } from '@/components/common/charts/composed-chart';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { Currency } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect, useState } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';

const ChartByAccount = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByAccount);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedAccounts);
  const currency = useAppSelector((state) => state.settings.currency);
  const dispatch = useAppDispatch();
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (selectedIds.length === 0) {
        dispatch(
          getFinanceByCategoryAsyncThunk({
            type: FinanceReportEnum.ACCOUNT,
            filter: FinanceReportFilterEnum.ALL,
          }),
        );
      }
    }
  }, [dispatch, selectedIds]);

  useEffect(() => {
    if (Array.isArray(financeByCategory)) {
      const processedData = financeByCategory.map((item) => {
        const baseCurrency = 'USD';

        const convertedIncome = getExchangeAmount({
          amount: item.totalIncome,
          fromCurrency: baseCurrency as Currency,
          toCurrency: currency,
        });

        const convertedExpense = getExchangeAmount({
          amount: item.totalExpense,
          fromCurrency: baseCurrency as Currency,
          toCurrency: currency,
        });

        const baseAmountValue = item.totalIncome > 0 ? item.totalIncome : -item.totalExpense;
        const convertedBalance = getExchangeAmount({
          amount: baseAmountValue,
          fromCurrency: baseCurrency as Currency,
          toCurrency: currency,
        });

        return {
          icon: item.icon,
          name: item.name,
          totalExpense: convertedExpense.convertedAmount,
          totalIncome: convertedIncome.convertedAmount,
          balance: convertedBalance.convertedAmount,
        };
      });
      setData(processedData);
    } else {
      setData([]);
    }
  }, [financeByCategory, currency, getExchangeAmount]);

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
                key: 'totalExpense',
                name: 'Expense',
                color: COLORS.DEPS_DANGER.LEVEL_2,
                stackId: 'a', // Gộp vào cùng một cột
              },
              {
                key: 'totalIncome',
                name: 'Income',
                color: COLORS.DEPS_SUCCESS.LEVEL_2,
                stackId: 'a', // Gộp vào cùng một cột
              },
            ]}
            tooltipFormatter={(item) => (
              <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                  {item.icon && renderIconOrImage(item.icon)}
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1 text-sm">
                  <span>Balance:</span>
                  <span className="font-bold ml-1">{formatCurrency(item.balance, currency)}</span>
                </div>
              </div>
            )}
            currency={currency}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default ChartByAccount;
