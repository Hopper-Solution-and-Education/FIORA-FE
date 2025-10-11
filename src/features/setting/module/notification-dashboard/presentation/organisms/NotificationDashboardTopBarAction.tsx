import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { setNotificationDashboardFilter } from '../../slices';
import { NotificationDashboardFilterState } from '../../slices/types';
import NotificationDashboardColumnMenu from '../molecules/NotificationDashboardColumnMenu';
import NotificationDashboardFilterMenu from '../molecules/NotificationDashboardFilterMenu';
import NotificationDashboardSearch from '../molecules/NotificationDashboardSearch';

/**
 * Top bar action component that handles search, filtering, and column management
 * This component is completely self-contained and manages its own Redux state
 */
const NotificationDashboardTopBarAction = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Get current filter state from Redux store
  const filter = useAppSelector((state) => state.notificationDashboard.filter);

  // Handle filter changes and dispatch to Redux store
  // This triggers API calls with new filter criteria
  const handleFilterChange = useCallback(
    (newFilter: NotificationDashboardFilterState) => {
      dispatch(setNotificationDashboardFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex justify-between items-center gap-2">
      {/* Left side: Search and filter controls */}
      <div className="flex items-center gap-2">
        {/* Self-contained search component with debounce */}
        <NotificationDashboardSearch />
        {/* Filter menu for advanced filtering options */}
        <NotificationDashboardFilterMenu value={filter} onFilterChange={handleFilterChange} />
      </div>

      {/* Right side: Column management */}
      <div className="flex items-center gap-2">
        <CommonTooltip content="Create Email Template">
          <Button
            onClick={() => {
              router.push('/setting/notification/email-template');
            }}
            variant="outline"
            size="icon"
            className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
          >
            <Icons.mail className="w-5 h-5" />
          </Button>
        </CommonTooltip>
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
            {/* Column visibility and ordering controls */}
            <NotificationDashboardColumnMenu />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NotificationDashboardTopBarAction;
