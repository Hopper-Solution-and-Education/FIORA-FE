'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditTermsAndConditionsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/EditTermsAndConditionsPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default function Page() {
  return <EditTermsAndConditionsPageRender />;
}
