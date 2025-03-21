'use client';
import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { Icons } from '@/components/Icon';
import { CreateAccountModal } from '@/features/home/module/account/components/CreateAccountPage';
import { setAccountDialogOpen } from '@/features/home/module/account/slices';
import { fetchAccounts, fetchParents } from '@/features/home/module/account/slices/actions';
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
    dispatch(fetchParents());
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
    <div className="p-4 md:px-6">
      <div className="flex justify-end">
        <button
          onClick={() => dispatch(setAccountDialogOpen(true))}
          className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white"
        >
          <Icons.add className="h-6 w-6" />
        </button>
      </div>
      <PositiveAndNegativeBarChart
        title="Accounts"
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

      <CreateAccountModal />
      {/* 
      <AccountDetailDialog
        account={selectedAccount}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      <EditAccountDialog
        account={selectedAccount}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSubmit={handleEditSubmit}
        allAccounts={allAccounts}
      /> */}
    </div>
  );
};

export default AccountDashboard;
