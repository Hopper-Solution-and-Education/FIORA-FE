'use client';

import { STATUS_COLOR } from '@/features/profile/constant';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { cn } from '@/shared/lib';
import { LucideIcon } from 'lucide-react';

interface FormHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  status?: EKYCStatus;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'text-blue-600',
  status,
}) => {
  const renderStatusBadge = () => {
    if (!status) {
      return null;
    }
    const statusLable = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return (
      <div
        className={cn(
          'rounded-md px-4 py-2',
          STATUS_COLOR[status].color,
          STATUS_COLOR[status].textColor,
        )}
      >
        {statusLable}
      </div>
    );
  };
  return (
    <div className="mb-4 flex justify-between">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 bg-${iconColor.split('-')[1]}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      <div>{renderStatusBadge()}</div>
    </div>
  );
};

export default FormHeader;
