import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import {
  SavingInterestFilterState,
  setEmailFilter,
  setFromDateFilter,
  setMembershipTierFilter,
  setStatusFilter,
  setToDateFilter,
  setUpdatedByFilter,
} from '../../slices';
import { SavingInterestTableData } from '../types/saving-interest.type';
import SavingInterestFilterMenu from './SavingInterestFilterMenu';
import SavingInterestSearch from './SavingInterestSearch';

interface SavingInterestTopBarActionProps {
  data?: SavingInterestTableData[];
}

const SavingInterestTopBarAction = ({ data = [] }: SavingInterestTopBarActionProps) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.savingInterest);

  const handleFilterChange = useCallback(
    (newFilter: SavingInterestFilterState) => {
      // Dispatch individual filter actions
      if (newFilter.status !== filter.status) {
        dispatch(setStatusFilter(newFilter.status));
      }
      if (newFilter.membershipTier !== filter.membershipTier) {
        dispatch(setMembershipTierFilter(newFilter.membershipTier));
      }
      if (newFilter.email !== filter.email) {
        dispatch(setEmailFilter(newFilter.email));
      }
      if (newFilter.updatedBy !== filter.updatedBy) {
        dispatch(setUpdatedByFilter(newFilter.updatedBy));
      }
      if (newFilter.fromDate !== filter.fromDate) {
        dispatch(setFromDateFilter(newFilter.fromDate));
      }
      if (newFilter.toDate !== filter.toDate) {
        dispatch(setToDateFilter(newFilter.toDate));
      }
    },
    [dispatch, filter],
  );

  return (
    <div className="flex items-center gap-2">
      <SavingInterestSearch />
      <SavingInterestFilterMenu value={filter} onFilterChange={handleFilterChange} data={data} />
    </div>
  );
};

export default SavingInterestTopBarAction;
