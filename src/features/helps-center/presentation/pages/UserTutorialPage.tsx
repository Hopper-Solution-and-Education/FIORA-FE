import { EmptyState } from '@/components/common/organisms';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserSession } from '../../hooks/useUserSession';
import { useGetUserTutorialQuery } from '../../store/api/helpsCenterApi';
import { ParsedFaqContent } from '../atoms';
import PostDetailHeader from '../organisms/PostDetailHeader';

const UserTutorialPage = () => {
  const router = useRouter();

  const { data, isLoading } = useGetUserTutorialQuery();

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
        title={data?.title ?? 'User Tutorial'}
        canEdit={isAdminOrCs}
        onEdit={() => {
          if (data?.id) {
            router.push(`/helps-center/user-tutorial/edit/${data?.id}`);
          }
        }}
        hasContent={hasContent}
      />
      {hasContent ? (
        <div className="border border-gray-200 p-4">
          <ParsedFaqContent htmlContent={data.content} />
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No User Tutorial Yet"
          description="No content available. Click to edit and add user tutorial."
          actionLabel={isAdminOrCs ? 'Edit User Tutorial' : undefined}
          onAction={
            isAdminOrCs && data?.id
              ? () => {
                  router.push(`/helps-center/user-tutorial/edit/${data.id}`);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default UserTutorialPage;
