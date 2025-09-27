import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../../slices';
import { ReferralCronjobFilterState } from '../../slices/types';
import { ReferralCronjobTableData } from '../types/referral.type';
import ReferralFilterMenu from './ReferralFilterMenu';
import ReferralSearch from './ReferralSearch';

interface ReferralTopBarActionProps {
  data?: ReferralCronjobTableData[];
}

const ReferralTopBarAction = ({ data = [] }: ReferralTopBarActionProps) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.referralCronjob.filter);

  const handleFilterChange = useCallback(
    (newFilter: ReferralCronjobFilterState) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex items-center gap-2">
      <ReferralSearch />
      <ReferralFilterMenu value={filter} onFilterChange={handleFilterChange} data={data} />
    </div>
  );
};

export default ReferralTopBarAction;
