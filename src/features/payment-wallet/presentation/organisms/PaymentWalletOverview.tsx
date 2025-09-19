'use client';

import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { CURRENCY } from '@/shared/constants';
import { useMemo } from 'react';
import { WalletDepositButton, WalletTransferButton, WalletWithdrawButton } from '../atoms';
import { usePaymentWalletDashboard } from '../hooks';
import { PercentageMetricCard } from '../molecules';

type PaymentWalletOverviewProps = {
  enableDeposit?: boolean;
  enableWithdraw?: boolean;
  enableTransfer?: boolean;
};

const PaymentWalletOverview = ({
  enableDeposit = true,
  enableWithdraw = true,
  enableTransfer = true,
}: PaymentWalletOverviewProps) => {
  const { dashboardMetrics, dashboardLoading } = usePaymentWalletDashboard();

  const metrics = useMemo(() => {
    if (!dashboardMetrics) {
      return {
        totalFXMovedIn: 0,
        totalFXMovedOut: 0,
        totalBalance: 0,
        totalAvailableBalance: 0,
        totalFrozen: 0,
        accumulatedEarn: 0,
        annualFlexInterest: 0,
      };
    }

    return {
      totalFXMovedIn: dashboardMetrics.totalMovedIn,
      totalFXMovedOut: dashboardMetrics.totalMovedOut,
      totalBalance: dashboardMetrics.totalBalance,
      totalAvailableBalance: dashboardMetrics.totalAvailableBalance,
      totalFrozen: dashboardMetrics.totalFrozen,
      accumulatedEarn: dashboardMetrics.accumulatedEarn,
      annualFlexInterest: dashboardMetrics.annualFlexInterest,
    };
  }, [dashboardMetrics]);

  if (dashboardLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total FX Moved In"
          value={metrics.totalFXMovedIn}
          type="income"
          icon="banknoteArrowUp"
          currency={CURRENCY.FX}
        />
        <MetricCard
          title="Total FX Moved Out"
          value={metrics.totalFXMovedOut}
          type="expense"
          icon="banknoteArrowDown"
          currency={CURRENCY.FX}
        />

        <PercentageMetricCard
          title="Annual Flexi Interest"
          value={metrics.annualFlexInterest}
          type="income"
        />

        <div className="flex justify-end gap-4">
          {enableDeposit && <WalletDepositButton />}

          {enableTransfer && <WalletTransferButton />}

          {enableWithdraw && <WalletWithdrawButton />}
        </div>
      </div>

      {/* Bottom Row - Balance Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value={metrics.totalBalance}
          type="neutral"
          icon="wallet"
          description="Total FX Balance"
          currency={CURRENCY.FX}
        />

        <MetricCard
          title="Available Balance"
          value={metrics.totalAvailableBalance}
          type="income"
          icon="banknote"
          description="Total available FX for trading"
          currency={CURRENCY.FX}
        />

        <MetricCard
          title="Frozen"
          value={metrics.totalFrozen}
          type="expense"
          icon="lock"
          description="Total FX being processed"
          currency={CURRENCY.FX}
        />

        <MetricCard
          title="Accumulated Earn"
          value={metrics.accumulatedEarn}
          type="income"
          icon="trendingUp"
          description="Accumulated Reward Earned"
          currency={CURRENCY.FX}
        />
      </div>
    </div>
  );
};

export default PaymentWalletOverview;
