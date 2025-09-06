import { Badge } from '@/components/ui/badge';

interface MembershipStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_COLOR: Record<string, string> = {
  successful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export const MembershipStatusBadge = ({ status, className }: MembershipStatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase();
  const color =
    STATUS_COLOR[normalizedStatus] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

  return (
    <Badge variant="secondary" className={`${color} ${className || ''} font-medium`}>
      {status}
    </Badge>
  );
};

export default MembershipStatusBadge;
