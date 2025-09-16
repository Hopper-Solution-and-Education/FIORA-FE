import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../slices';
import { FlexiInterestCronjobFilterState } from '../slices/type';
import FlexiInterestFilterMenu from './FlexiInterestFilterMenu';
import FlexiInterestSearch from './FlexiInterestSearch';

const FlexiInterestHeaderTopLeft = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.flexiInterestCronjob);

  const handleOnChangeFilter = useCallback(
    (newFilter: FlexiInterestCronjobFilterState) => {
      dispatch(setFilter(newFilter));
    },
    [dispatch],
  );

  return (
    <div className="flex gap-4 items-center">
      <FlexiInterestSearch />

      <FlexiInterestFilterMenu value={filter} onFilterChange={handleOnChangeFilter} />
    </div>
  );
};

export default FlexiInterestHeaderTopLeft;
