import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback } from 'react';
import { setFilter } from '../slices';
import { FlexiInterestCronjobFilterState } from '../slices/type';
import FlexiInterestFilterMenu from './FlexiInterestFilterMenu';
import FlexiInterestSearch from './FlexiInterestSearch';

const FlexiInterestHeaderTopLeft = ({ dataFilterOptions }: { dataFilterOptions: any }) => {
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

      <FlexiInterestFilterMenu
        dataOptions={dataFilterOptions}
        value={filter}
        onFilterChange={handleOnChangeFilter}
      />
    </div>
  );
};

export default FlexiInterestHeaderTopLeft;
