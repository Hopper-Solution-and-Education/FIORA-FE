import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { Currency } from '@/shared/types';
import { convertCurrency } from '@/shared/utils/convertCurrency';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions';

const ChartByAccount = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByAccount);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedAccounts);
  const currency = useAppSelector((state) => state.settings.currency);
  const dispatch = useAppDispatch();

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

  // data showing when income and data showing when expense
  const data = Array.isArray(financeByCategory)
    ? financeByCategory.map((item) => ({
        name: item.name,
        column1: convertCurrency(item.totalExpense, item.currency as Currency, currency),
        column2: convertCurrency(item.totalIncome, item.currency as Currency, currency),
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
            title="Chart by Account"
            columns={[
              { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
              { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
            ]}
            currency={currency}
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default ChartByAccount;
