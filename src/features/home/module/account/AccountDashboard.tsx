'use client';

import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { Icons } from '@/components/Icon';
import { fetchAccounts, fetchParents } from '@/features/home/module/account/slices/actions';
import { getAccountColorByType } from '@/features/home/module/account/slices/utils';
import { COLORS } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Account } from '@/features/home/module/account/slices/types';
import { formatCurrency } from '@/shared/utils';

const AccountDashboard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { accounts, refresh } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchParents());
  }, [dispatch, refresh]);

  const chartData: BarItem[] = useMemo(() => {
    if (!accounts.data) return [];
    return accounts.data
      .filter((account: Account) => {
        return !account?.parentId;
      })
      .map((account: Account) => {
        return {
          id: account.id,
          name: account.name,
          icon: account.icon,
          value: Number(account.balance) || 0,
          type: account.type,
          color: getAccountColorByType(account.type),
          children: account.children?.map((child) => ({
            id: child.id,
            name: child.name,
            icon: child.icon,
            value: Number(child.balance) || 0,
            type: child.type,
            color: getAccountColorByType(child.type),
          })),
        };
      });
  }, [accounts]);

  const handleDisplayDetail = (item: any) => {
    if (item.id) {
      router.push(`/home/account/update/${item.id}`);
    }
  };

  if (accounts.isLoading) return <div>Loading...</div>;
  if (accounts.error) return <div className="text-red-600">Error: {accounts.error}</div>;

  return (
    <div className="p-4 md:px-6">
      <div className="flex justify-end">
        <Link href="/home/account/create">
          <button className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white">
            <Icons.add className="h-6 w-6" />
          </button>
        </Link>
      </div>
      <PositiveAndNegativeBarChart
        title="Accounts"
        data={chartData}
        xAxisFormatter={(value) => formatCurrency(value)}
        levelConfig={{
          totalName: 'Net Balance',
          colors: { 0: COLORS.DEPS_SUCCESS.LEVEL_1 },
        }}
        callback={handleDisplayDetail}
      />
    </div>
  );
};

export default AccountDashboard;
