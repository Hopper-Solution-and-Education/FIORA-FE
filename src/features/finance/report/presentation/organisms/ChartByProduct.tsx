import { ComposedChart } from '@/components/common/charts';
import { renderIconOrImage } from '@/components/common/charts/composed-chart';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { Currency } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { Cell } from 'recharts';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

const ChartByProduct = () => {
  const financeByProduct = useAppSelector((state) => state.financeControl.financeByProduct);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedProducts);
  const currency = useAppSelector((state) => state.settings.currency);
  const dispatch = useAppDispatch();
  const { formatCurrency, getExchangeAmount } = useCurrencyFormatter();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading) {
      if (selectedIds.length === 0) {
        dispatch(
          getFinanceByCategoryAsyncThunk({
            type: FinanceReportEnum.PRODUCT,
            filter: FinanceReportFilterEnum.ALL,
          }),
        );
      }
    }
  }, [dispatch, selectedIds]);

  useEffect(() => {
    const processData = async () => {
      if (Array.isArray(financeByProduct)) {
        const processedData = await Promise.all(
          financeByProduct.map(async (item) => {
            const profit = getExchangeAmount({
              amount: item.totalProfit,
              fromCurrency: item.baseCurrency as Currency,
              toCurrency: currency,
            }).convertedAmount;

            const expense = getExchangeAmount({
              amount: item.totalExpense,
              fromCurrency: item.baseCurrency as Currency,
              toCurrency: currency,
            }).convertedAmount;

            const income = getExchangeAmount({
              amount: item.totalIncome,
              fromCurrency: item.baseCurrency as Currency,
              toCurrency: currency,
            }).convertedAmount;

            return {
              name: item.name,
              icon: item.icon,

              column1: expense,

              column2: income,

              column3: Math.abs(profit),
              profitStatus: profit < 0 ? 'negative' : 'positive',
              originalProfit: profit,
              currency: currency,
            };
          }),
        );
        setData(processedData);
      } else {
        setData([]);
      }
    };

    processData();
  }, [financeByProduct, currency]);

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
            {
              key: 'column3',
              name: 'Profit',
              color: COLORS.DEPS_INFO.LEVEL_2,
              customCell: (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.profitStatus === 'negative' ? '#FFB800' : COLORS.DEPS_INFO.LEVEL_2}
                />
              ),
            },
          ]}
          tooltipFormatter={(data) => {
            const profit = data.originalProfit;
            return (
              <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                <div className="flex items-center gap-2">
                  {data.icon && renderIconOrImage(data.icon)}
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200">{data.name}</p>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <div
                    className="w-3 h-3 mr-2 rounded-sm"
                    style={{ backgroundColor: COLORS.DEPS_DANGER.LEVEL_2 }}
                  />
                  <span className="text-sm">Expense:</span>
                  <span className="font-bold ml-1 text-sm">
                    {formatCurrency(Number(data.column1), data.currency as Currency)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <div
                    className="w-3 h-3 mr-2 rounded-sm"
                    style={{ backgroundColor: COLORS.DEPS_SUCCESS.LEVEL_2 }}
                  />
                  <span className="text-sm">Income:</span>
                  <span className="font-bold ml-1 text-sm">
                    {formatCurrency(Number(data.column2), data.currency as Currency)}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                  <div
                    className="w-3 h-3 mr-2 rounded-sm"
                    style={{
                      backgroundColor: profit < 0 ? '#FFB800' : COLORS.DEPS_INFO.LEVEL_2,
                    }}
                  />
                  <span className="text-sm">Profit:</span>
                  <span className="font-bold ml-1 text-sm">
                    {formatCurrency(Number(profit), data.currency as Currency)}
                  </span>
                </div>
              </div>
            );
          }}
          currency={currency}
        />
      )}
    </div>
  );
};

export default ChartByProduct;
