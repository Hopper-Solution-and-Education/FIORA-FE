import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationDashboardColumnMenu from '../molecules/NotificationDashboardColumnMenu';
import NotificationDashboardFilterMenu from '../molecules/NotificationDashboardFilterMenu';
import NotificationDashboardSearch from '../molecules/NotificationDashboardSearch';

interface NotificationDashboardTopBarActionProps {
  filter: any;
  onFilterChange: (newFilter: any) => void;
  onApply: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  className?: string;
}

const NotificationDashboardTopBarAction = ({
  filter,
  onFilterChange,
  onApply,
  search,
  onSearchChange,
  className,
}: NotificationDashboardTopBarActionProps) => {
  return (
    <div className={`flex justify-between items-center gap-2 ${className || ''}`}>
      <div className="flex items-center gap-2">
        <NotificationDashboardSearch value={search} onChange={onSearchChange} />
        <NotificationDashboardFilterMenu
          value={filter}
          onFilterChange={onFilterChange}
          onApply={onApply}
        />
      </div>

      <div className="">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
            >
              <Icons.slidersHorizontal className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-max" align="end" sideOffset={8}>
            <NotificationDashboardColumnMenu />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NotificationDashboardTopBarAction;
