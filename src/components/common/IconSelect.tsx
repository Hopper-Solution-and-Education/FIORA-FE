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
import { cn } from '@/lib/utils';
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
}

const IconSelect: React.FC<IconSelectProps> = ({
  selectedIcon,
  onIconChange,
  className,
  props,
}) => {
  return (
    <div className={cn(className)} {...props}>
      <Select value={selectedIcon} onValueChange={(value) => onIconChange(value)}>
        <SelectTrigger className="w-full">
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
