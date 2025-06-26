import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { Wallet } from '../domain/entity/Wallet';

export function transformWalletsToChartData(wallets: Wallet[]): TwoSideBarItem[] {
  const items = wallets.map((w) => ({
    id: w.id,
    name: w.name || w.type,
    positiveValue: w.frBalanceActive > 0 ? w.frBalanceActive : 0,
    negativeValue: w.frBalanceActive < 0 ? w.frBalanceActive : 0,
    icon: w.icon,
    type: w.type,
  }));

  const total = wallets.reduce((sum, w) => sum + w.frBalanceActive, 0);
  const totalItem: TwoSideBarItem = {
    id: 'total',
    name: 'Total',
    positiveValue: total >= 0 ? total : 0,
    negativeValue: total < 0 ? total : 0,
    type: 'total',
  };
  return [totalItem, ...items];
}
