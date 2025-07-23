import { Badge } from '@/components/ui/badge';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';

interface NotificationStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_COLOR: Record<NotificationLogType, string> = {
  SENT: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export const NotificationStatusBadge = ({ status, className }: NotificationStatusBadgeProps) => {
  const color = STATUS_COLOR[status as NotificationLogType] || 'bg-gray-100 text-gray-800';

  return (
    <Badge variant="secondary" className={` hover:bg-${color} ${color} ${className || ''}`}>
      {status}
    </Badge>
  );
};

export default NotificationStatusBadge;
