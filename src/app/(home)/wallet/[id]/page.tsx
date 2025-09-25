'use client';

import NotFound from '@/app/not-found';
import Loading from '@/components/common/atoms/Loading';
import { useMatchWalletDetail } from '@/features/home/module/wallet/presentation/hooks';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const SavingDashboardRender = dynamic(
  () =>
    import('@/features/home/module/saving/presentation/pages').then(
      (mod) => mod.SavingDashboardPage,
    ),
  {
    loading: () => <Loading />,
  },
);

function WalletDetail() {
  const params = useParams();
  const walletId = params?.id as string;
  const walletType = useMatchWalletDetail(walletId);

  if (walletType === 'Saving') {
    return <SavingDashboardRender />;
  }

  return NotFound();
}

export default WalletDetail;
