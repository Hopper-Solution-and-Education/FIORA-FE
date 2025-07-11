'use client';

import {
  useInitialFrozenAmount,
  useInitializeUserWallet,
} from '@/features/home/module/wallet/presentation/hooks';

const Updater = () => {
  useInitializeUserWallet();
  useInitialFrozenAmount();

  return null;
};

export default Updater;
