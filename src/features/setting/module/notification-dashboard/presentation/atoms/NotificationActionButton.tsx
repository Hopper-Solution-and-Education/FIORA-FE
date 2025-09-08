import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { usePathname, useRouter } from 'next/navigation';

interface NotificationActionButtonProps {
  notificationId: string;
}

const NotificationActionButton = ({ notificationId }: NotificationActionButtonProps) => {
  const router = useRouter();
  const path = usePathname();
  const isSettingDashboard = !!path?.includes('setting');

  const onClick = () => {
    router.push(
      routeConfig(
        isSettingDashboard ? RouteEnum.NotificationDetail : RouteEnum.UserNotificationDetail,
        { id: notificationId },
      ),
    );
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="View Detail">
      <Icons.post className="w-4 h-4" />
    </Button>
  );
};

export default NotificationActionButton;
