'use client';

import PositiveAndNegativeBarChart from '@/components/common/charts/positive-negative-bar-chart';
import { BarItem } from '@/components/common/charts/positive-negative-bar-chart/type';
import ChartSkeleton from '@/components/common/organisms/ChartSkeleton';
import DeleteAccountDialog from '@/features/home/module/account/components/DeleteAccountDialog';
import NavigateToAccountDialog from '@/features/home/module/account/components/NavigateToAccountDialog';
import { fetchAccounts, fetchParents } from '@/features/home/module/account/slices/actions';
import { mapAccountsToBarItems } from '@/features/home/module/account/utils';
import { MODULE } from '@/shared/constants';
import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import DashboardHeader from './components/DashboardHeader';

const AccountDashboard = ({ module = MODULE.ACCOUNT }: { module: string | undefined }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);
  const { accounts, refresh, filterCriteria } = useAppSelector((state) => state.account);
  const { currency } = useAppSelector((state) => state.settings);

  useEffect(() => {
    dispatch(fetchAccounts(filterCriteria));
    dispatch(fetchParents(filterCriteria));
  }, [dispatch, refresh]);

  const chartData: BarItem[] = useMemo(() => {
    if (!accounts.data) return [];
    return mapAccountsToBarItems(accounts.data, currency);
  }, [accounts.data, currency]);

  type Depth = 0 | 1 | 2;

  const levelConfig: {
    totalName: string;
    colorPositive: Record<Depth, string>;
    colorNegative: Record<Depth, string>;
  } = {
    totalName: 'Total',
    colorPositive: {
      0: COLORS.DEPS_SUCCESS.LEVEL_1,
      1: COLORS.DEPS_SUCCESS.LEVEL_3,
      2: COLORS.DEPS_SUCCESS.LEVEL_5,
    },
    colorNegative: {
      0: COLORS.DEPS_DANGER.LEVEL_1,
      1: COLORS.DEPS_DANGER.LEVEL_3,
      2: COLORS.DEPS_DANGER.LEVEL_5,
    },
  };

  const handleDisplayDetail = (item: any) => {
    if (item.id) {
      router.push(`/account/update/${item.id}`);
    }
  };

  const handleChartClick = () => {
    if (module === MODULE.HOME) {
      setShowNavigateDialog(true);
    }
  };

  const handleNavigateConfirm = () => {
    setShowNavigateDialog(false);
    router.push('/account');
  };

  if (accounts.error) return <div className="text-red-600">Error: {accounts.error}</div>;

  return (
    <>
      {module === MODULE.ACCOUNT && <DashboardHeader />}
      {accounts.isLoading ? (
        <ChartSkeleton />
      ) : (
        <div
          ref={chartRef}
          onClick={handleChartClick}
          className={module === MODULE.HOME ? 'cursor-pointer relative' : ''}
        >
          {module === 'HOME' && (
            <span className="absolute top-2 right-2 text-sm text-gray-500">
              Click to view details
            </span>
          )}
          <PositiveAndNegativeBarChart
            title={module === MODULE.ACCOUNT ? 'Accounts' : undefined}
            data={chartData}
            xAxisFormatter={(value) => formatCurrency(value, currency)}
            currency={currency}
            levelConfig={levelConfig}
            callback={module === MODULE.ACCOUNT ? handleDisplayDetail : undefined}
            header={
              module === MODULE.HOME ? (
                <h3 className="text-lg font-semibold p-6">Account Balance</h3>
              ) : undefined
            }
          />
        </div>
      )}
      {module === MODULE.ACCOUNT && <DeleteAccountDialog />}
      {module === MODULE.HOME && (
        <NavigateToAccountDialog
          isOpen={showNavigateDialog}
          onClose={() => setShowNavigateDialog(false)}
          onConfirm={handleNavigateConfirm}
        />
      )}
    </>
  );
};

export default AccountDashboard;
