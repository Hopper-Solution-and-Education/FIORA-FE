'use client';

import { useAppSelector } from '@/store';

export const useMatchWalletDetail = (id: string) => {
  const { wallets } = useAppSelector((state) => state.wallet);

  if (wallets && wallets.length > 0) {
    const matchedWallet = wallets.find((wallet) => wallet.id === id);

    if (matchedWallet) {
      return matchedWallet.type;
    }
  }

  return undefined;
};
