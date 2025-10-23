'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { INotificationDetails } from '@/features/setting/module/notification/domain/entity';
import { NotificationDetails } from '@/features/setting/module/notification/presentation/organisms/NotificationDetails';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { useSession } from 'next-auth/react';
import { notFound, useParams, useRouter } from 'next/navigation';

const UserNotificationDetailPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: session } = useSession();

  const { data, isLoading } = useDataFetch<INotificationDetails>({
    endpoint: `/api/notification/${id}`,
    method: 'GET',
  });

  if (!data?.data && !isLoading) {
    return notFound();
  }

  const userEmail = session?.user?.email || '';

  return (
    data?.data && (
      <div className="px-4">
        <div className="flex border border-gray-200 rounded-lg">
          <div className="w-full p-6">
            <NotificationDetails data={data.data} emailSelected={userEmail} />
          </div>
        </div>
        <div className="mb-4">
          <DefaultSubmitButton
            onBack={() => {
              router.back();
            }}
          />
        </div>
      </div>
    )
  );
};

export default UserNotificationDetailPage;
