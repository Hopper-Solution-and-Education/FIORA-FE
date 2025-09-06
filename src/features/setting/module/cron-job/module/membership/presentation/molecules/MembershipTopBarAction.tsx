import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../../slices';
import { MembershipCronjobFilterState } from '../../slices/types';
import MembershipFilterMenu from './MembershipFilterMenu';
import MembershipSearch from './MembershipSearch';

/**
 * Top bar action component that handles search, filtering for membership dashboard
 * This component is completely self-contained and manages its own Redux state
 */
const MembershipTopBarAction = () => {
  const dispatch = useAppDispatch();
  // Get current filter state from Redux store
  const filter = useAppSelector((state) => state.membershipCronjob.filter);

  // Handle filter changes and dispatch to Redux store
  // This triggers API calls with new filter criteria
  const handleFilterChange = useCallback(
    (newFilter: MembershipCronjobFilterState) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex justify-between items-center gap-2">
      {/* Left side: Search and filter controls */}
      <div className="flex items-center gap-2">
        {/* Self-contained search component with debounce */}
        <MembershipSearch />
        {/* Filter menu for advanced filtering options */}
        <MembershipFilterMenu value={filter} onFilterChange={handleFilterChange} />
      </div>

      {/* Right side: Additional actions can be added here */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Icons.download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default MembershipTopBarAction;
