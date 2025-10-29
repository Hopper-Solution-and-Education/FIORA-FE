import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import useMarkNotificationAsRead from '@/shared/hooks/useMarkNotificationAsRead';
import { routeConfig } from '@/shared/utils/route';
import { usePathname, useRouter } from 'next/navigation';
import { NotificationDashboardTableData } from '../types/setting.type';

interface NotificationActionButtonProps {
  notificationData: NotificationDashboardTableData;
}

const NotificationActionButton = ({ notificationData }: NotificationActionButtonProps) => {
  const router = useRouter();
  const path = usePathname();
  const isSettingDashboard = !!path?.includes('setting');
  const { markAsRead } = useMarkNotificationAsRead();
  const { mutate: mutateNotification } = useDataFetch({
    endpoint: '/api/notification/user?unread=true&channel=BOX',
    method: 'GET',
  });
  const onClick = async () => {
    router.push(
      routeConfig(
        isSettingDashboard ? RouteEnum.NotificationDetail : RouteEnum.UserNotificationDetail,
        { id: notificationData.id },
      ),
    );
    if (notificationData.userNotifications[0] && !notificationData.userNotifications[0].isRead) {
      await markAsRead(notificationData.userNotifications[0].id);
      mutateNotification();
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="View Detail">
      <Icons.post className="w-4 h-4" />
    </Button>
  );
};

export default NotificationActionButton;
