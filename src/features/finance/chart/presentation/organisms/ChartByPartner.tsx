import { ComposedChart } from '@/components/common/charts';
import { FinanceReportEnum } from '@/features/setting/data/module/finance/constant/FinanceReportEnum';
import { FinanceReportFilterEnum } from '@/features/setting/data/module/finance/constant/FinanceReportFilterEnum';
import { COLORS } from '@/shared/constants/chart';
import { Currency } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { getFinanceByCategoryAsyncThunk } from '../../slices/actions/getFinanceByCategoryAsyncThunk';
import { ChartSkeleton } from '@/components/common/organisms';
import { convertCurrency } from '@/shared/utils/convertCurrency';

const ChartByPartner = () => {
  const financeByPartner = useAppSelector((state) => state.financeControl.financeByPartner);
  const isLoading = useAppSelector((state) => state.financeControl.isLoadingGetFinance);
  const selectedIds = useAppSelector((state) => state.financeControl.selectedPartners);
  const currency = useAppSelector((state) => state.settings.currency);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (selectedIds.length === 0) {
        dispatch(
          getFinanceByCategoryAsyncThunk({
            type: FinanceReportEnum.PARTNER,
            filter: FinanceReportFilterEnum.ALL,
          }),
        );
      }
    }
  }, [dispatch, selectedIds]);

  // data showing when income and data showing when expense
  const data = Array.isArray(financeByPartner)
    ? financeByPartner.map((item) => ({
        name: item.name,
        column1: convertCurrency(item.totalExpense, item.currency as Currency, currency),
        column2: convertCurrency(item.totalIncome, item.currency as Currency, currency),
        column3: convertCurrency(item.totalProfit, item.currency as Currency, currency),
      }))
    : [];

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
            { key: 'column3', name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_2 },
          ]}
          currency={currency}
        />
      )}
    </div>
  );
};

export default ChartByPartner;
