import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NOTIFICATION_DASHBOARD_FILTER_CONSTANTS } from '../../data/constant';

interface NotificationDashboardSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const NotificationDashboardSearch = ({
  value,
  onChange,
  placeholder = NOTIFICATION_DASHBOARD_FILTER_CONSTANTS.SEARCH_PLACEHOLDER,
  className,
}: NotificationDashboardSearchProps) => {
  return (
    <div className={`relative ${className || ''}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
};

export default NotificationDashboardSearch;
