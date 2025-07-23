import { useGetAnnouncement } from '@/features/landing/hooks/useGetAnnouncement';

const useAnnouncementManager = () => {
  const { announcement, isLoading } = useGetAnnouncement();

  return {
    announcement,
    isLoading,
  };
};

export default useAnnouncementManager;
