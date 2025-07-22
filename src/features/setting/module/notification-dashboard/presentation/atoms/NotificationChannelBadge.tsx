import { Badge } from '@/components/ui/badge';

interface NotificationChannelBadgeProps {
  channel: string;
  className?: string;
}

const CHANNEL_COLOR: Record<string, string> = {
  Email: 'bg-blue-100 text-blue-800',
  Box: 'bg-cyan-100 text-cyan-800',
};

export const NotificationChannelBadge = ({ channel, className }: NotificationChannelBadgeProps) => {
  const color = CHANNEL_COLOR[channel] || 'bg-gray-100 text-gray-800';
  return <Badge className={`${color} ${className || ''}`}>{channel}</Badge>;
};

export default NotificationChannelBadge;
