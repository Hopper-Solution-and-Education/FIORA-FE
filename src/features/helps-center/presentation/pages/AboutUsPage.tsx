import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { useRouter } from 'next/navigation';
import { Post } from '../../domain/entities/models/faqs';
import { useUserSession } from '../../hooks/useUserSession';
import { ParsedFaqContent } from '../atoms';
import AboutUsHeader from '../organisms/AboutUsHeader';

const AboutUsPage = () => {
  const router = useRouter();
  const { data } = useDataFetcher<Post>({
    endpoint: '/api/helps-center/about-us',
    method: 'GET',
  });

  const { isAdminOrCs } = useUserSession();

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
