import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { routeConfig } from '@/shared/utils/route';
import { useRouter } from 'next/navigation';

interface NotificationActionButtonProps {
  notificationId: string;
}

const NotificationActionButton = ({ notificationId }: NotificationActionButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push(routeConfig(RouteEnum.NotificationDetail, { id: notificationId }));
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="View Detail">
      <Icons.post className="w-4 h-4" />
    </Button>
  );
};

export default NotificationActionButton;
