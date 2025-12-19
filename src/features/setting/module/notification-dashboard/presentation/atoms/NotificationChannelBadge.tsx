import { Badge } from '@/components/ui/badge';
import { formatUnderlineString } from '@/shared/utils/stringHelper';
import { ChannelType } from '../../domain';

interface NotificationChannelBadgeProps {
  channel: string;
  className?: string;
}

const CHANNEL_COLOR: Record<ChannelType, string> = {
  EMAIL: 'bg-blue-100 text-blue-800',
  BOX: 'bg-teal-100 text-teal-700',
};

export const NotificationChannelBadge = ({ channel, className }: NotificationChannelBadgeProps) => {
  const color = CHANNEL_COLOR[channel as ChannelType] || 'bg-gray-100 text-gray-800';
  return (
    <Badge className={`hover:bg-${color} ${color} ${className || ''}`}>
      {formatUnderlineString(channel)}
    </Badge>
  );
};

export default NotificationChannelBadge;
