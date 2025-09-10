import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../../slices';
import { MembershipCronjobFilterState } from '../../slices/types';
import MembershipFilterMenu from './MembershipFilterMenu';
import MembershipSearch from './MembershipSearch';

const MembershipTopBarAction = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.membershipCronjob.filter);

  const handleFilterChange = useCallback(
    (newFilter: MembershipCronjobFilterState) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <MembershipSearch />
        <MembershipFilterMenu value={filter} onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default MembershipTopBarAction;
