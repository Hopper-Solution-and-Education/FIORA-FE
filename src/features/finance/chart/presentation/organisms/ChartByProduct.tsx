import { ComposedChart } from '@/components/common/charts';
import { ChartSkeleton } from '@/components/common/organisms';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';

const ChartByProduct = () => {
  const financeByProduct = useAppSelector((state) => state.financeControl.financeByProduct);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      dispatch(
        getFinanceByCategoryAsyncThunk({
          type: FinanceReportEnum.PRODUCT,
          filter: FinanceReportFilterEnum.ALL,
        }),
      );
    }
  }, [dispatch]);

  // data showing when income and data showing when expense
  const data = Array.isArray(financeByProduct)
    ? financeByProduct.map((item) => ({
        name: item.name,
        column1: item.totalExpense,
        column2: item.totalIncome,
      }))
    : [];

  return (
    <div className="space-y-8">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <ComposedChart
          data={data}
          title="Chart by Product"
          columns={[
            { key: 'column1', name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_2 },
            { key: 'column2', name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_2 },
          ]}
          lines={[{ key: 'line', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 }]}
          currency="VNĐ"
        />
      )}
    </div>
  );
};

export default ChartByProduct;
