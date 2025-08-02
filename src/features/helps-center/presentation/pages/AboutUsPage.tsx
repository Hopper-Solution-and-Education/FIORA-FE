import { Skeleton } from '@/components/ui/skeleton';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { useRouter } from 'next/navigation';
import { Post } from '../../domain/entities/models/faqs';
import { useUserSession } from '../../hooks/useUserSession';
import { ParsedFaqContent } from '../atoms';
import AboutUsHeader from '../organisms/AboutUsHeader';

const AboutUsPage = () => {
  const router = useRouter();
  const { data, isLoading } = useDataFetcher<Post>({
    endpoint: '/api/helps-center/about-us',
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
          <AboutUsHeader
            data={data?.data}
            canEdit={isAdminOrCs}
            onEdit={() => {
              router.push(`/helps-center/about-us/edit/${data?.data.id}`);
            }}
          />
          <ParsedFaqContent htmlContent={data?.data.content} />
        </>
      )}
    </div>
  );
};

export default AboutUsPage;
