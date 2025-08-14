'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useUserSession } from '../../hooks/useUserSession';
import { useGetTermsAndConditionsQuery } from '../../store/api/helpsCenterApi';
import ParsedFaqContent from '../atoms/ParsedFaqContent';
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

  return (
    <div className="px-6 pb-6 h-full w-full ">
      {data && (
        <>
          <PostDetailHeader
            title={data.title}
            canEdit={isAdminOrCs}
            onEdit={() => {
              router.push(`/helps-center/terms-and-conditions/edit/${data.id}`);
            }}
          />
          <div className="border border-gray-200 p-4">
            <ParsedFaqContent htmlContent={data.content} />
          </div>
        </>
      )}
    </div>
  );
}
