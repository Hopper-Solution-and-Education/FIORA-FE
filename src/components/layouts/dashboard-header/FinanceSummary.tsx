import { COLORS } from '@/shared/constants/chart';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { WalletType } from '@/features/home/module/wallet/domain/enum';
import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { CURRENCY } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants/RouteEnum';

export default function FinanceSummary() {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const frozenAmount = useAppSelector((state) => state.wallet.frozenAmount);
  const loading = useAppSelector((state) => state.wallet.loading);
  const router = useRouter();

  const { FBalance, FDebt } = useMemo(() => {
    const totalBalance =
      (wallets?.reduce((sum, w) => sum + (w.frBalanceActive || 0), 0) || 0) + (frozenAmount || 0);
    const totalDebt =
      wallets
        ?.filter((w) => w.type === WalletType.Debt)
        .reduce((sum, w) => sum + (w.frBalanceActive || 0), 0) || 0;
    return {
      FBalance: formatFIORACurrency(totalBalance, CURRENCY.FX),
      FDebt: formatFIORACurrency(totalDebt, CURRENCY.FX),
    };
  }, [wallets, frozenAmount]);
  const isLoading = loading || !wallets || frozenAmount === null;

  return (
    <div
      className="flex flex-col gap-1 mt-2 w-[400px] flex-grow md:flex-grow-0 cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => router.push(RouteEnum.WalletDashboard)}
      title="Go to Wallet Dashboard"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 rounded-md px-2 py-0.5 font-semibold text-white"
        style={{
          background: COLORS.DEPS_SUCCESS.LEVEL_1,
          height: 24,
          fontSize: 13,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <span>FBalance:</span>
        <span className="ml-auto truncate">{isLoading ? 'Loading...' : FBalance}</span>
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 rounded-md px-2 py-0.5 font-semibold text-white"
        style={{
          background: COLORS.DEPS_DANGER.LEVEL_1,
          height: 24,
          fontSize: 13,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <span>FDebt:</span>
        <span className="ml-auto truncate">{isLoading ? 'Loading...' : FDebt}</span>
      </motion.div>
    </div>
  );
}
