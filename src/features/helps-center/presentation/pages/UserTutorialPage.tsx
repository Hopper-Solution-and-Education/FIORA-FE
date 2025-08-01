import { Skeleton } from '@/components/ui/skeleton';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { useRouter } from 'next/navigation';
import { Post } from '../../domain/entities/models/faqs';
import { useUserSession } from '../../hooks/useUserSession';
import { ParsedFaqContent } from '../atoms';
import UserTutorialHeader from '../organisms/UserTutorialHeader';

const UserTutorialPage = () => {
  const router = useRouter();
  const { data, isLoading } = useDataFetcher<Post>({
    endpoint: '/api/helps-center/user-tutorial',
    method: 'GET',
  });

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
      {data?.data && (
        <>
          <UserTutorialHeader
            data={data?.data}
            canEdit={isAdminOrCs}
            onEdit={() => {
              router.push(`/helps-center/user-tutorial/edit/${data?.data.id}`);
            }}
          />
          <div className="border border-gray-200 p-4">
            <ParsedFaqContent htmlContent={data?.data.content} />
          </div>
        </>
      )}
    </div>
  );
};

export default UserTutorialPage;
