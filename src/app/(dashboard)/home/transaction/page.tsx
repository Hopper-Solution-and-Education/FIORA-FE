'use client';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import dynamic from 'next/dynamic';

const TransactionPage = dynamic(
  () => import('@/features/home/module/transaction/TransactionPage'),
  {
    loading: () => <Loading />,
  },
);

const Transaction = () => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.TRANSACTION_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <TransactionPage />;
};

export default Transaction;
