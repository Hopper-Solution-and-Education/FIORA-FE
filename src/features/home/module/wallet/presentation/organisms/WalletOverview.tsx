'use client';

import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import { Wallet } from '../../domain';
import { WalletType } from '../../domain/enum';

const WalletOverview = () => {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const loading = useAppSelector((state) => state.wallet.loading);
  const frozenAmount = useAppSelector((state) => state.wallet.frozenAmount);

  const totalActive = useMemo(
    () => wallets?.reduce((sum: number, w: Wallet) => sum + w.frBalanceActive, 0) || 0,
    [wallets],
  );

  const totalDebt = useMemo(
    () =>
      wallets
        ?.filter((w) => w.type === WalletType.Debt)
        .reduce((sum: number, w: Wallet) => sum + (w.frBalanceActive || 0), 0) || 0,
    [wallets],
  );

  const totalFrozen = frozenAmount || 0;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
      <MetricCard
        title="Total Active"
        value={totalActive}
        type="income"
        icon="arrowLeftRight"
        description="Total available FX for trading"
      />

      <MetricCard
        title="Total Frozen"
        value={totalFrozen}
        type="total"
        icon="snowflake"
        description="Total FX pending activation"
      />

      <MetricCard
        title="Total Debt"
        value={totalDebt}
        type="expense"
        icon="banknoteArrowDown"
        description="Total FX Debt"
      />
    </div>
  );
};

export default WalletOverview;
