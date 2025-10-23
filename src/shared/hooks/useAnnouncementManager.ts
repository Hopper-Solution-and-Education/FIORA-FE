'use client';

import { useGetAnnouncement } from '@/features/landing/hooks/useGetAnnouncement';
import { useEffect, useMemo, useState } from 'react';

const ANNOUNCEMENT_SESSION_KEY = 'announcementClosed';

const useAnnouncementManager = () => {
  const { announcement, isLoading } = useGetAnnouncement();
  const [show, setShow] = useState(false);

  const isActive = useMemo(() => {
    return announcement?.data?.[0]?.isActive && !isLoading;
  }, [announcement, isLoading]);

  useEffect(() => {
    if (!sessionStorage.getItem(ANNOUNCEMENT_SESSION_KEY) && isActive) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isActive]);

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
