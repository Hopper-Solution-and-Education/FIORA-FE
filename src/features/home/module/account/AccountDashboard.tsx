'use client';
import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { fetchAccounts } from '@/features/home/module/account/slices/actions';
import { Account } from '@/features/home/module/account/slices/types';
import { getAccountColorByType } from '@/features/home/module/account/slices/utils';
import { COLORS, DEFAULT_LOCALE } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useMemo } from 'react';

const AccountDashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  // * CHART DATA ZONE *
  const chartData: BarItem[] = useMemo(() => {
    if (!accounts.data) return [];

    return accounts.data.map((account: Account) => {
      return {
        id: account.id,
        name: account.name,
        value: Number(account.balance) || 0,
        type: account.type,
        color: getAccountColorByType(account.type),
        children: account.children?.map((child) => ({
          id: child.id,
          name: child.name,
          value: Number(child.balance) || 0,
          type: child.type,
          color: getAccountColorByType(child.type),
        })),
      };
    });
  }, [accounts]);

  return (
    <>
      <PositiveAndNegativeBarChart
        title="Account Balances"
        data={chartData}
        xAxisFormatter={(value) =>
          new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency: 'VND' }).format(
            value,
          )
        }
        levelConfig={{
          totalName: 'Net Balance',
          colors: {
            0: COLORS.DEPS_SUCCESS.LEVEL_1,
          },
        }}
      />
    </>
  );
};

export default AccountDashboard;
