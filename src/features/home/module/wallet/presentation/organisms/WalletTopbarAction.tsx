'use client';

import { PercentageMetricCard } from '@/components/common/metric';
import { WalletAction } from '@/components/common/organisms';
import { fetchPaymentWalletDashboardAsyncThunk } from '@/features/payment-wallet/slices/actions';
import { FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo } from 'react';
import { setFilterCriteria } from '../../slices';
import { WalletFilterMenu, WalletSearch } from '../molecules';

interface WalletTopbarActionProps {
  enableDeposit?: boolean;
  enableTransfer?: boolean;
  enableWithdraw?: boolean;
  enableFilter?: boolean;
  searchType?: 'normal' | 'deposit';
}

const WalletTopbarAction = ({
  enableDeposit = true,
  enableTransfer = true,
  enableWithdraw = true,
  enableFilter = true,
  searchType = 'normal',
}: WalletTopbarActionProps) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // Selectors
  const filterCriteria = useAppSelector((state) => state.wallet.filterCriteria);
  const minBalance = useAppSelector((state) => state.wallet.minBalance);
  const maxBalance = useAppSelector((state) => state.wallet.maxBalance);
  const dashboardMetrics = useAppSelector((state) => state.paymentWallet.dashboardMetrics);

  const metrics = useMemo(() => {
    if (!dashboardMetrics) {
      return {
        annualFlexInterest: 0,
      };
    }
    return {
      annualFlexInterest: dashboardMetrics.annualFlexInterest,
    };
  }, [dashboardMetrics]);

  // Functions
  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(setFilterCriteria(newFilter));
  };

  // Query
  const fetchDashboard = useCallback(() => {
    if (session?.user?.id) {
      return dispatch(fetchPaymentWalletDashboardAsyncThunk());
    }
    return Promise.resolve();
  }, [dispatch, session?.user?.id]);

  // Effects
  useEffect(() => {
    if (!dashboardMetrics && session?.user?.id) {
      fetchDashboard();
    }
  }, [session?.user?.id, dashboardMetrics, fetchDashboard]);

  return (
    <div className="flex flex-wrap gap-2 w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <WalletSearch searchType={searchType} />
        {enableFilter && searchType === 'normal' && (
          <WalletFilterMenu
            filterCriteria={filterCriteria}
            onFilterChange={handleFilterChange}
            minBalance={minBalance ?? undefined}
            maxBalance={maxBalance ?? undefined}
          />
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <PercentageMetricCard
          title="Annual Flexi Interest"
          value={metrics.annualFlexInterest}
          type="income"
        />
        <WalletAction
          enableDeposit={enableDeposit}
          enableTransfer={enableTransfer}
          enableWithdraw={enableWithdraw}
        />
      </div>
    </div>
  );
};

export default WalletTopbarAction;
