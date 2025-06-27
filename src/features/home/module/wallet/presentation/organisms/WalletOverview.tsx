import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { RootState, useAppDispatch } from '@/store';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { WalletType } from '../../domain/enum';
import { useInitializeUserWallet } from '../hooks';
import { fetchFrozenAmount } from '../../slices/actions';

const DEFAULT_FROZEN_AMOUNT = 0;

const WalletOverview = () => {
  const { wallets, loading } = useInitializeUserWallet();
  const dispatch = useAppDispatch();
  const frozenAmount = useSelector((state: RootState) => state.wallet.frozenAmount);

  useEffect(() => {
    if (!frozenAmount) {
      dispatch(fetchFrozenAmount());
    }
  }, []);

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

  const totalFrozen = frozenAmount ?? DEFAULT_FROZEN_AMOUNT;

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
