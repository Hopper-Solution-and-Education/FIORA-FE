import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

interface NotificationActionButtonProps {
  onClick?: () => void;
}

const NotificationActionButton = ({ onClick }: NotificationActionButtonProps) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="View Detail">
      <Icons.page className="w-4 h-4" />
    </Button>
  );
};

export default NotificationActionButton;
