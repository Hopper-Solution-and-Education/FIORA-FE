import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../../slices';
import { ReferralTransactionFilterState } from '../../slices/types';
import ReferralTransactionFilterMenu from '../organisms/ReferralTransactionFilterMenu';
import ReferralTransactionSearch from './ReferralTransactionSearch';

const ReferralTransactionTopBarAction = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.referralTransaction.filter);

  const handleFilterChange = useCallback(
    (newFilter: ReferralTransactionFilterState) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex items-center gap-2">
        <ReferralTransactionSearch />
        <ReferralTransactionFilterMenu value={filter} onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
};

export default ReferralTransactionTopBarAction;
