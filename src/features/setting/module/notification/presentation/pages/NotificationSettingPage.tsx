'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { INotificationDetails } from '../../domain/entity';
import { NotificationDetails } from '../organisms/NotificationDetails';
import { RecipientList } from '../organisms/RecipientList';

const NotificationSettingPage = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data, isLoading } = useDataFetch<INotificationDetails>({
    endpoint: `/api/notification/${id}`,
    method: 'GET',
  });

  const [emailSelected, setEmailSelected] = useState<string>('');

  if (!data?.data && !isLoading) {
    return notFound();
  }

  return (
    data?.data && (
      <div className="px-4">
        <div className="flex border border-gray-200 rounded-lg">
          <div className="flex flex-1 overflow-hidden">
            {/* Notification Details Section */}
            <div className="w-2/3 p-6 border-r border-gray-200">
              <NotificationDetails data={data.data} emailSelected={emailSelected} />
            </div>

            {/* Recipient List Section */}
            <div className="w-1/3 p-6">
              <RecipientList
                data={data.data}
                emailSelected={emailSelected}
                setEmailSelected={setEmailSelected}
              />
            </div>
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

export default NotificationSettingPage;
