'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, Shield, XCircle } from 'lucide-react';

type UserStatus = 'Active' | 'Inactive' | 'Blocked' | 'Pending';

interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
  showIcon?: boolean;
}

export function UserStatusBadge({ status, className, showIcon = false }: UserStatusBadgeProps) {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
          icon: CheckCircle,
        };
      case 'Inactive':
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
          icon: Clock,
        };
      case 'Blocked':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
          icon: Shield,
        };
      case 'Pending':
        return {
          variant: 'outline' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
          icon: XCircle,
        };
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'font-medium',
        config.className,
        showIcon && 'flex items-center gap-1',
        className,
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {status}
    </Badge>
  );
}
