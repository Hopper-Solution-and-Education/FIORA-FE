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
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <div>
        <NotificationDashboardSearch value={search} onChange={onSearchChange} />
        <NotificationDashboardFilterMenu
          value={filter}
          onFilterChange={onFilterChange}
          onApply={onApply}
        />
      </div>

      <div>
        <NotificationDashboardColumnMenu />
      </div>
    </div>
  );
};

export default NotificationDashboardTopBarAction;
