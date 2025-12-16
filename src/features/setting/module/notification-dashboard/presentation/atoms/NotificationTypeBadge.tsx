import { Badge } from '@/components/ui/badge';
import { formatUnderlineString } from '@/shared/utils/stringHelper';

interface NotificationTypeBadgeProps {
  notifyType: string;
  className?: string;
}

const TYPE_COLOR: Record<string, string> = {
  Support: 'bg-blue-100 text-blue-800',
  Deposit: 'bg-blue-100 text-blue-800',
  MemberShip: 'bg-indigo-100 text-indigo-800',
  'Referral Bonus': 'bg-purple-100 text-purple-800',
  eKYC: 'bg-cyan-100 text-cyan-800',
};

export const NotificationTypeBadge = ({ notifyType, className }: NotificationTypeBadgeProps) => {
  const color = TYPE_COLOR[notifyType] || 'bg-gray-100 text-gray-800';
  return (
    <Badge variant="secondary" className={`hover:bg-${color} ${color} ${className || ''}`}>
      {formatUnderlineString(notifyType)}
    </Badge>
  );
};

export default NotificationTypeBadge;
