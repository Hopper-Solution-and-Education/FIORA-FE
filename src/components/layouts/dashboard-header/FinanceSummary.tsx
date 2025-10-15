import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { WalletType } from '@/features/home/module/wallet/domain/enum';
import { COLORS } from '@/shared/constants/chart';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppSelector } from '@/store';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';

// Memoized Bar component to prevent unnecessary re-renders
const Bar = memo(function BarComponent({
  label,
  value,
  percent,
  color,
}: {
  label: string;
  value: string;
  percent: number;
  color: string;
}) {
  const showInside = percent > 0 && percent >= 80;
  return (
    <div className="flex items-center w-full">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 rounded-md px-2 py-0.5 font-semibold text-white"
        style={{
          background: color,
          height: 24,
          fontSize: 13,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {showInside && (
          <>
            <span>{label}:</span>
            <span className="ml-auto truncate">{value}</span>
          </>
        )}
      </motion.div>
      {!showInside && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}: {value}
        </span>
      )}
    </div>
  );
});

export default function FinanceSummary() {
  const wallets = useAppSelector((state) => state.wallet.wallets);
  const frozenAmount = useAppSelector((state) => state.wallet.frozenAmount);
  const loading = useAppSelector((state) => state.wallet.loading);
  const router = useRouter();
  const { formatCurrency } = useCurrencyFormatter();

  // Memoize the onClick handler
  const handleClick = useCallback(() => {
    router.push(RouteEnum.WalletDashboard);
  }, [router]);

  const { totalBalance, totalDebt, FBalance, FDebt } = useMemo(() => {
    const balance =
      (wallets?.reduce((sum, w) => sum + (w.frBalanceActive || 0), 0) || 0) + (frozenAmount || 0);

    const debt =
      wallets
        ?.filter((w) => w.type === WalletType.Debt)
        .reduce((sum, w) => sum + (w.frBalanceActive || 0), 0) || 0;

    return {
      totalBalance: balance,
      totalDebt: debt,
      FBalance: formatCurrency(balance, 'FX', {
        applyExchangeRate: false,
      }),
      FDebt: formatCurrency(debt, 'FX', {
        applyExchangeRate: false,
      }),
    };
  }, [wallets, frozenAmount, formatCurrency]);

  const isLoading = loading || !wallets || frozenAmount === null;

  // Calculate percentages based on the larger value to ensure proper visualization
  const maxValue = Math.max(Math.abs(totalBalance), Math.abs(totalDebt));
  const balancePercent = maxValue > 0 ? (Math.abs(totalBalance) / maxValue) * 100 : 0;
  const debtPercent = maxValue > 0 ? (Math.abs(totalDebt) / maxValue) * 100 : 0;

  return (
    <div
      className="flex flex-col gap-1 mt-2 w-full flex-grow md:flex-grow-0 cursor-pointer hover:opacity-90 transition-opacity"
      onClick={handleClick}
    >
      <CommonTooltip content="Go to Wallet Dashboard">
        <Bar
          label="FBalance"
          value={isLoading ? 'Loading...' : FBalance}
          percent={balancePercent}
          color={COLORS.DEPS_SUCCESS.LEVEL_1}
        />
        <Bar
          label="FDebt"
          value={isLoading ? 'Loading...' : FDebt}
          percent={debtPercent}
          color={COLORS.DEPS_DANGER.LEVEL_1}
        />
      </CommonTooltip>
    </div>
  );
}
