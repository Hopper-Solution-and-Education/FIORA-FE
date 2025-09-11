'use client';

import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { CURRENCY } from '@/shared/constants';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import { WalletDepositButton, WalletTransferButton, WalletWithdrawButton } from '../atoms';

type WalletDetailsOverviewProps = {
  enableDeposit?: boolean;
  enableWithdraw?: boolean;
  enableTransfer?: boolean;
};

const WalletDetailsOverview = ({
  enableDeposit = true,
  enableWithdraw = true,
  enableTransfer = true,
}: WalletDetailsOverviewProps) => {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const loading = useAppSelector((state) => state.wallet.loading);

  // Calculate metrics based on the photo design
  const metrics = useMemo(() => {
    if (!wallets || wallets.length === 0) {
      return {
        totalFXMovedIn: 300000,
        totalFXMovedOut: 200000,
        annualFlexiInterest: 0.5,
        totalBalance: 200000,
        totalAvailable: 100000,
        totalFrozen: 100000,
        accumulatedEarn: 1000,
      };
    }

    const totalBalance = wallets.reduce((sum, w) => sum + w.frBalanceActive, 0);
    const totalFrozen = wallets.reduce((sum, w) => sum + w.frBalanceFrozen, 0);
    const totalAvailable = totalBalance - totalFrozen;

    return {
      totalFXMovedIn: 300000, // Mock data - would come from transaction history
      totalFXMovedOut: 200000, // Mock data - would come from transaction history
      annualFlexiInterest: 0.5, // Mock data - would come from settings/config
      totalBalance,
      totalAvailable,
      totalFrozen,
      accumulatedEarn: 1000, // Mock data - would come from rewards/earnings
    };
  }, [wallets]);

  if (loading) {
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

        <MetricCard title="Annual Flexi Interest" value={0.5} type="income" />

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
          type="total"
          icon="wallet"
          description="Total FX Balance"
          currency={CURRENCY.FX}
        />

        <MetricCard
          title="Total Available"
          value={metrics.totalAvailable}
          type="income"
          icon="arrowLeftRight"
          description="Total available FX for trading"
          currency={CURRENCY.FX}
        />

        <MetricCard
          title="Total Frozen"
          value={metrics.totalFrozen}
          type="neutral"
          icon="snowflake"
          description="Total FX being processed"
          currency={CURRENCY.FX}
          className="!opacity-75"
        />

        <MetricCard
          title="Accumulated Earn"
          value={metrics.accumulatedEarn}
          type="income"
          icon="piggyBank"
          description="Accumulated Reward Earned"
          currency={CURRENCY.FX}
        />
      </div>
    </div>
  );
};

export default WalletDetailsOverview;
