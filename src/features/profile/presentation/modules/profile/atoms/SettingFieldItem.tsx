'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/shared/utils';
import { Edit, Trash2 } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface SettingFieldItemProps {
  label: string;
  description: string;
  icon: ReactNode;
  onEdit?: () => void;
  editTooltip?: string;
  variant?: 'default' | 'danger';
  showEdit?: boolean;
  disabled?: boolean;
}

export const SettingFieldItem: FC<SettingFieldItemProps> = ({
  label,
  description,
  icon,
  onEdit,
  editTooltip = 'Edit',
  variant = 'default',
  showEdit = true,
  disabled = false,
}) => {
  const isDanger = variant === 'danger';

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-normal text-gray-900">{label}</h4>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5 flex-1">
          <div className={cn('mt-0.5', isDanger ? 'text-red-500' : 'text-green-500')}>{icon}</div>
          <span
            className={cn(
              'text-xs leading-relaxed max-w-[50%]',
              isDanger ? 'text-red-600' : 'text-gray-500',
            )}
          >
            {description}
          </span>
        </div>
        {showEdit && onEdit && (
          <CommonTooltip content={editTooltip}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-5 w-5 flex-shrink-0 hover:bg-transparent p-0',
                isDanger ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-900',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
              onClick={onEdit}
              disabled={disabled}
            >
              {isDanger ? <Trash2 className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </Button>
          </CommonTooltip>
        )}
      </div>
    </div>
  );
};

export default SettingFieldItem;
