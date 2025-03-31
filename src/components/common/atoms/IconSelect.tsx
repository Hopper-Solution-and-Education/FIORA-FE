import { Icons } from '@/components/Icon';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { iconOptions } from '@/shared/constants/data';
import { useGetIconLabel } from '@/shared/utils';
import React from 'react';

interface ListIconProps {
  icon: string;
}

const ListIcon: React.FC<ListIconProps> = ({ icon }) => {
  const Icon = Icons[icon as keyof typeof Icons] || Icons['circle'];
  const iconLabel = useGetIconLabel(icon);
  return (
    <div className="flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4" /> : <span>No Icon</span>}
      <span>{iconLabel || icon}</span>
    </div>
  );
};

interface IconSelectProps {
  selectedIcon: string;
  onIconChange: (value: string) => void;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
  required?: boolean; // Thêm prop required
  label?: string; // Thêm prop label để hiển thị nhãn nếu cần
}

const IconSelect: React.FC<IconSelectProps> = ({
  selectedIcon,
  onIconChange,
  className,
  props,
  required = false, // Giá trị mặc định là false
  label,
}) => {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-300">
          <span className="flex items-center gap-1">
            {label}
            {required && (
              <span className="text-red-500 dark:text-red-400" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
      )}
      <Select value={selectedIcon} onValueChange={(value) => onIconChange(value)}>
        <SelectTrigger className={cn('w-full', required && !selectedIcon ? 'border-red-500' : '')}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <ListIcon icon={selectedIcon} />
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="h-60 overflow-y-auto">
          {iconOptions.map((data) => (
            <SelectGroup key={data.label}>
              <SelectLabel>{data.label}</SelectLabel>
              {data.options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div className="flex items-center gap-2">
                    {item.icon ? <item.icon className="w-4 h-4" /> : <span>No Icon</span>}
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default IconSelect;
