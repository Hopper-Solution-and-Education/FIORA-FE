'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useUserSession } from '../../hooks/useUserSession';
import { useGetTermsAndConditionsQuery } from '../../store/api/helpsCenterApi';
import PostDetailHeader from '../organisms/PostDetailHeader';

export default function TermsAndConditionsPage() {
  const { isAdminOrCs } = useUserSession();
  const router = useRouter();

  const { data, isLoading } = useGetTermsAndConditionsQuery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return data?.content ? (
    <div className="px-6 pb-6 h-full w-full ">
      <PostDetailHeader
        title="TERM OF USE"
        canEdit={isAdminOrCs}
        onEdit={() => {
          router.push(`/helps-center/terms-and-conditions/edit`);
        }}
      />

      <iframe src={data?.content} className="w-[90%] mx-auto !h-[70vh] "></iframe>
    </div>
  ) : (
    <></>
  );
}
