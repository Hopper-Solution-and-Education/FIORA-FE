import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { Currency } from '@/shared/types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

const ChartByCategory = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const viewChartByCategory = useAppSelector((state) => state.financeControl.viewChartByCategory);
  const dispatch = useAppDispatch();
  const currency = useAppSelector((state) => state.settings.currency);

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        getFinanceByCategoryAsyncThunk({
          type: FinanceReportEnum.CATEGORY,
          filter:
            viewChartByCategory === 'income'
              ? FinanceReportFilterEnum.INCOME
              : FinanceReportFilterEnum.EXPENSE,
        }),
      );
    }
  }, [dispatch, viewChartByCategory]);

  // data showing when income and data showing when expense
  const data = Array.isArray(financeByCategory)
    ? financeByCategory.map((item) => ({
        name: item.name,
        column: convertCurrency(
          viewChartByCategory === 'income' ? item.totalIncome : item.totalExpense,
          item.currency as Currency,
          currency,
        ),
        icon: item.icon ?? 'wallet',
      }))
    : [];

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
