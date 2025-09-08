'use client';

import { usePathname } from 'next/navigation';

const useNotificationDashboardMode = () => {
  const pathname = usePathname();
  const isPersonalNotificationDashboard = pathname === '/notification';

  return {
    isPersonalNotificationDashboard,
  };
};

export default useNotificationDashboardMode;
