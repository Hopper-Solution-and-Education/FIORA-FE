import { Icons } from '@/components/Icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ICON_SIZE } from '@/shared/constants/size';

interface ProductIconSelectProps {
  field: any;
  label?: string;
}

const ICONS = Object.entries(Icons).map(([key, value]) => ({
  label: key,
  value,
}));

const ProductIconSelect = ({ field, label }: ProductIconSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="Select an icon" />
        </SelectTrigger>
        <SelectContent>
          {ICONS.map((icon) => {
            const Icon = icon.value;
            return (
              <SelectItem key={icon.label} value={icon.label}>
                <div className="flex items-center">
                  <Icon size={ICON_SIZE.MD} />
                  <label className="ml-2">
                    {icon.label.charAt(0).toUpperCase() + icon.label.slice(1)}
                  </label>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductIconSelect;
