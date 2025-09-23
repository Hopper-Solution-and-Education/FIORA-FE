import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { COLORS } from '@/shared/constants/chart';
import { Wallet } from '../domain/entity/Wallet';
import { WalletType } from '../domain/enum';

/**
 * Transform wallet data to chart format for positive-negative bar chart
 * @param wallets - Array of wallet objects
 * @param frozenAmount - Total frozen amount across all wallets
 * @returns Array of TwoSideBarItem for chart rendering
 */
export function transformWalletsToChartData(
  wallets: Wallet[],
  frozenAmount: number = 0,
): TwoSideBarItem[] {
  // Transform each wallet to chart item format
  const items = wallets.map((w) => {
    const baseItem: TwoSideBarItem = {
      id: w.id,
      name: w.name || w.type,
      positiveValue: w.frBalanceActive > 0 ? w.frBalanceActive : 0,
      negativeValue: w.frBalanceActive < 0 ? w.frBalanceActive : 0,
      icon: w.icon,
      type: w.type,
    };

    // Add inner bar for wallet payment type to show frozen amount
    if (w.type === WalletType.Payment) {
      baseItem.innerBar = [
        {
          id: 'frozen',
          name: 'Frozen',
          positiveValue: frozenAmount,
          negativeValue: 0,
          colorPositive: COLORS.DEPS_DISABLE.LEVEL_1,
        },
      ];
    }

    return baseItem;
  });

  // Calculate total balance across all wallets
  const total = wallets.reduce((sum, w) => sum + w.frBalanceActive, 0) - frozenAmount;

  // Create total item with inner bar showing frozen amount
  const totalItem: TwoSideBarItem = {
    id: 'total',
    name: 'Total',
    positiveValue: total >= 0 ? total : 0,
    negativeValue: total < 0 ? total : 0,
    type: 'total',
    innerBar: [
      {
        id: 'frozen',
        name: 'Frozen',
        positiveValue: frozenAmount,
        negativeValue: 0,
        colorPositive: COLORS.DEPS_DISABLE.LEVEL_1,
      },
    ],
  };

  return [totalItem, ...items];
}
