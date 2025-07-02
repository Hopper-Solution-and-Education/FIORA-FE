import { Loading } from '@/components/common/atoms';
import dynamic from 'next/dynamic';

const WalletSettingPage = dynamic(
  () =>
    import('@/features/home/module/wallet/presentation/module/setting/pages').then(
      (mod) => mod.WalletSetting,
    ),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <WalletSettingPage />;
};

export default page;
