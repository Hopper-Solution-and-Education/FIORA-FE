import { EmptyState } from '@/components/common/organisms';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserSession } from '../../hooks/useUserSession';
import { useGetAboutUsQuery } from '../../store/api/helpsCenterApi';
import { ParsedFaqContent } from '../atoms';
import PostDetailHeader from '../organisms/PostDetailHeader';

const AboutUsPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetAboutUsQuery();

  const { isAdminOrCs } = useUserSession();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  const hasContent = !!data?.content;

  return (
    <div className="px-6 space-y-6">
      <PostDetailHeader
        title={data?.title ?? 'About Us'}
        canEdit={isAdminOrCs}
        onEdit={() => {
          if (data?.id) {
            router.push(`/helps-center/about-us/edit/${data?.id}`);
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
          title="No About Us Yet"
          description="No content available. Click to edit and add about us."
          actionLabel={isAdminOrCs ? 'Edit About Us' : undefined}
          onAction={
            isAdminOrCs && data?.id
              ? () => {
                  router.push(`/helps-center/about-us/edit/${data.id}`);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default AboutUsPage;
