'use client';
import { adminContainer } from '@/features/setting/module/landing/di/adminDIContainer';
import { GetAnnouncementUseCase } from '@/features/setting/module/landing/domain/usecases/GetAnnoucementUseCase';
import useSWR, { SWRConfiguration } from 'swr';

export const useGetAnnouncement = (swrOptions?: SWRConfiguration) => {
  const { data, error } = useSWR(
    `announcement`,
    async () => {
      const getAnnouncementUseCase =
        adminContainer.get<GetAnnouncementUseCase>(GetAnnouncementUseCase);
      return await getAnnouncementUseCase.execute();
    },
    swrOptions,
  );

  return {
    announcement: data,
    isLoading: !error && !data,
    isError: error,
  };
};
