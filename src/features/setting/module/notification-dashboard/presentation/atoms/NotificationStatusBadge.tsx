import { Badge } from '@/components/ui/badge';

interface NotificationStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_COLOR: Record<string, string> = {
  Success: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
};

export const NotificationStatusBadge = ({ status, className }: NotificationStatusBadgeProps) => {
  const color = STATUS_COLOR[status] || 'bg-gray-100 text-gray-800';
  return <Badge className={`${color} ${className || ''}`}>{status}</Badge>;
};

export default NotificationStatusBadge;
