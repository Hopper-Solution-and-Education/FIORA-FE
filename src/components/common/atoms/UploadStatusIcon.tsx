import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Upload, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconType = 'success' | 'error' | 'warning' | 'upload' | 'refresh';

interface UploadStatusIconProps {
  type: IconType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  upload: Upload,
  refresh: RefreshCw,
};

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

const colorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  upload: 'text-gray-400',
  refresh: 'text-primary',
};

const UploadStatusIcon: React.FC<UploadStatusIconProps> = ({ type, size = 'md', className }) => {
  const Icon = iconMap[type];

  return <Icon className={cn(sizeMap[size], colorMap[type], className)} />;
};

export default UploadStatusIcon;
