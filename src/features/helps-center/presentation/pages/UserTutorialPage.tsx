import { Skeleton } from '@/components/ui/skeleton';
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

  return (
    <div className="container mx-auto px-6 space-y-6">
      {data && (
        <>
          <PostDetailHeader
            title={data.title}
            canEdit={isAdminOrCs}
            onEdit={() => {
              router.push(`/helps-center/user-tutorial/edit/${data.id}`);
            }}
          />
          <div className="border border-gray-200 p-4">
            <ParsedFaqContent htmlContent={data.content} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserTutorialPage;
