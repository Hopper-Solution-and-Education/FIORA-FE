'use client';

import { EmptyState } from '@/components/common/organisms';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
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

  const hasContent = !!data?.content;

  return (
    <div className="px-6 pb-6 h-full w-full">
      <PostDetailHeader
        title={data?.title ?? 'Terms and Conditions'}
        canEdit={isAdminOrCs}
        onEdit={() => {
          if (data?.id) {
            router.push(`/helps-center/terms-and-conditions/edit/${data.id}`);
          }
        }}
        hasContent={hasContent}
      />

      {hasContent ? (
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <ParsedFaqContent htmlContent={data.content} />
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No Terms and Conditions Yet"
          description="No content available. Click to edit and add terms and conditions."
          actionLabel={isAdminOrCs ? 'Edit Terms and Conditions' : undefined}
          onAction={
            isAdminOrCs && data?.id
              ? () => {
                  router.push(`/helps-center/terms-and-conditions/edit/${data.id}`);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
