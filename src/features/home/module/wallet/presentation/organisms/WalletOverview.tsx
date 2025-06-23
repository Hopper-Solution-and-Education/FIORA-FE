import React, { useMemo } from 'react';
import MetricCard from '@/components/common/metric/MetricCard';
import { WalletType } from '../../domain/entity/WalletType';
import { Loading } from '@/components/common/atoms';
import { useInitializeUserWallet } from '../hooks';

const TOTAL_FROZEN_HARDCODED = 1000000;

const WalletOverview = () => {
  const { wallets, loading } = useInitializeUserWallet();

  const totalActive = useMemo(
    () => wallets?.reduce((sum, w) => sum + w.frBalanceActive, 0) || 0,
    [wallets],
  );

  const totalDebt = useMemo(
    () =>
      wallets
        ?.filter((w) => w.type === WalletType.Debt)
        .reduce((sum, w) => sum + (w.frBalanceActive || 0), 0) || 0,
    [wallets],
  );

  const totalFrozen = TOTAL_FROZEN_HARDCODED;

  console.log(wallets);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
      <MetricCard
        title="Total Active"
        value={totalActive}
        type="income"
        icon="wallet"
        description="Total available FX for trading"
      />

      <MetricCard
        title="Total Frozen"
        value={totalFrozen}
        type="total"
        icon="lock"
        description="Total FX pending activation"
      />

      <MetricCard
        title="Total Debt"
        value={totalDebt}
        type="expense"
        icon="credit-card"
        description="Total FX Debt"
      />
    </div>
  );
};

export default WalletOverview;
