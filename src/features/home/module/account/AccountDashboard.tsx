'use client';
import PositiveAndNegativeBarChart, {
  BarItem,
} from '@/components/common/positive-negative-bar-chart';
import { Icons } from '@/components/Icon';
import { CreateAccountModal } from '@/features/home/module/account/components/CreateAccountPage';
import DeleteAccountDialog from '@/features/home/module/account/components/DeleteAccountDialog';
import { UpdateAccountModal } from '@/features/home/module/account/components/UpdateAccountPage';
import {
  setAccountDialogOpen,
  setAccountUpdateDialog,
  setSelectedAccount,
} from '@/features/home/module/account/slices';
import { fetchAccounts, fetchParents } from '@/features/home/module/account/slices/actions';
import { Account } from '@/features/home/module/account/slices/types';
import { getAccountColorByType } from '@/features/home/module/account/slices/utils';
import { COLORS, DEFAULT_LOCALE } from '@/shared/constants/chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useMemo } from 'react';

const AccountDashboard = () => {
  const dispatch = useAppDispatch();
  const { accounts, refresh } = useAppSelector((state) => state.account);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchParents());
  }, [dispatch, refresh]);

  // * CHART DATA ZONE *
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

  // * LOGIC ZONE *
  const handleDisplayDetailDialog = (item: any) => {
    const findAccount = findAccountById(item.id, accounts.data);
    if (findAccount) {
      dispatch(setSelectedAccount(findAccount));
      dispatch(setAccountUpdateDialog(true));
    }
  };

  const findAccountById = (id: string, accounts: Account[] | undefined): Account | undefined => {
    if (!accounts) return undefined;
    return accounts.find((account) => account.id === id);
  };

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
        callback={handleDisplayDetailDialog}
      />

      <CreateAccountModal />

      <UpdateAccountModal />

      <DeleteAccountDialog />
    </div>
  );
};

export default AccountDashboard;
