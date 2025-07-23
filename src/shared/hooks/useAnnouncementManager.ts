import { useGetAnnouncement } from '@/features/landing/hooks/useGetAnnouncement';
import { useEffect, useState } from 'react';

const ANNOUNCEMENT_SESSION_KEY = 'announcementClosed';

const useAnnouncementManager = () => {
  const { announcement, isLoading } = useGetAnnouncement();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(ANNOUNCEMENT_SESSION_KEY)) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem(ANNOUNCEMENT_SESSION_KEY, '1');
  };

  return {
    announcement,
    isLoading,
    show,
    handleClose,
  };
};

export default useAnnouncementManager;
