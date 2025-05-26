import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

const ChartByAccount = () => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinanceByCategory);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        getFinanceByCategoryAsyncThunk({
          type: FinanceReportEnum.ACCOUNT,
          filter: FinanceReportFilterEnum.ALL,
        }),
      );
    }
  }, [dispatch]);

  // data showing when income and data showing when expense
  const data = Array.isArray(financeByCategory)
    ? financeByCategory.map((item) => ({
        name: item.name,
        column1: item.totalExpense,
        column2: item.totalIncome,
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
            lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
            currency="VNĐ"
          />
        </React.Fragment>
      )}
    </div>
  );
};

export default ChartByAccount;
