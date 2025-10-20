import { cn } from '@/shared/utils';
import React from 'react';

interface StatsItem {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

interface StatsDisplayProps {
  stats: StatsItem[];
  className?: string;
}

const variantMap = {
  default: 'text-gray-600 bg-gray-50',
  success: 'text-green-600 bg-green-50',
  error: 'text-red-600 bg-red-50',
  warning: 'text-yellow-600 bg-yellow-50',
};

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, className }) => {
  return (
    <div className={cn('flex gap-4 flex-wrap', className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'px-3 py-2 rounded-md text-center flex-1 min-w-[120px]',
            variantMap[stat.variant || 'default'],
          )}
        >
          <div className="text-2xl font-bold">{stat?.value || 0}</div>
          <div className="text-sm font-medium">{stat?.label || ''}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsDisplay;
