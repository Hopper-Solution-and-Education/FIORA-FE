import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/utils';
import { FC } from 'react';
import { FlexiInterestCronjobTableStatusType } from '../types/flexi-interest.type';

interface FlexiInterestStatusBadgeProps {
  status: FlexiInterestCronjobTableStatusType;
  className?: string;
}

const STATUS_COLOR: Record<FlexiInterestCronjobTableStatusType, string> = {
  successful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  fail: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const FlexiInterestStatusBadge: FC<FlexiInterestStatusBadgeProps> = ({ status, className }) => {
  const color =
    STATUS_COLOR[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';

  return (
    <Badge variant="outline" className={cn(color, className, 'font-medium')}>
      {status}
    </Badge>
  );
};

export default FlexiInterestStatusBadge;
