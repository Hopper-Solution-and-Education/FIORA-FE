'use client';

import { useGetMe } from '@/features/auth/hooks/useGetMe';
import {
  useInitialFrozenAmount,
  useInitializeUserWallet,
} from '@/features/home/module/wallet/presentation/hooks';

const Updater = () => {
  useInitializeUserWallet();
  useInitialFrozenAmount();
  useGetMe();

  return null;
};

export default Updater;
