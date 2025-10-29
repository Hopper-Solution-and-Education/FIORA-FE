'use client';

import { httpClient } from '@/config/http-client/HttpClient';
import { useCallback } from 'react';

const useMarkNotificationAsRead = () => {
  const markAsRead = useCallback(async (notificationId: string) => {
    return httpClient.patch(`/api/notification/${notificationId}`, {});
  }, []);

  return { markAsRead };
};

export default useMarkNotificationAsRead;
