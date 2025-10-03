import { Badge } from '@/components/ui/badge';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { cn } from '@/shared/lib';

interface UserEKYCStatusBadgeProps {
  status?: EKYCStatus | string;
  className?: string;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100',
  APPROVAL: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-100',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100',
  blocked: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:bg-gray-100',
};

const UserEKYCStatusBadge = ({ status, className }: UserEKYCStatusBadgeProps) => {
  if (!status) {
    return <span className="text-gray-400 text-sm">N/A</span>;
  }

  const normalizedStatus = status.toUpperCase();
  const color = STATUS_COLOR[normalizedStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  
  const displayText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <Badge
      variant="secondary"
      className={cn(color, 'font-medium', className)}
    >
      {displayText}
    </Badge>
  );
};

export default UserEKYCStatusBadge;