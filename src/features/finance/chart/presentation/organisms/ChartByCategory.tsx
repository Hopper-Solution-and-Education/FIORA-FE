import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

type Props = {
  viewBy: 'income' | 'expense';
};

const ChartByCategory = ({ viewBy }: Props) => {
  const financeByCategory = useAppSelector((state) => state.financeControl.financeByCategory);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinanceByCategory);
  const dispatch = useAppDispatch();

  console.log(financeByCategory);

  useEffect(() => {
    dispatch(
      getFinanceByCategoryAsyncThunk({
        type: FinanceReportEnum.CATEGORY,
        filter:
          viewBy === 'income' ? FinanceReportFilterEnum.INCOME : FinanceReportFilterEnum.EXPENSE,
      }),
    );
  }, [dispatch, viewBy]);

  // data showing when income and data showing when expense
  const expenseData = Array.isArray(financeByCategory)
    ? financeByCategory.map((item) => ({
        name: item.name,
        column1: item.totalExpense,
      }))
    : [];

  const incomeData = Array.isArray(financeByCategory)
    ? financeByCategory.map((item) => ({
        name: item.name,
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
            data={viewBy === 'income' ? incomeData : expenseData}
            title="Chart by Category"
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

export default ChartByCategory;
