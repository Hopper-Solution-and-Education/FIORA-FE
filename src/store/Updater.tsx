import {
  useInitialFrozenAmount,
  useInitializeUserWallet,
} from '@/features/home/module/wallet/presentation/module/client/hooks';

const Updater = () => {
  useInitializeUserWallet();
  useInitialFrozenAmount();
  return null;
};

export default Updater;
