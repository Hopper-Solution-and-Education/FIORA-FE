import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Input } from '@/components/ui/input';
import { FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useMemo } from 'react';
import { setFilterCriteria } from '../slices';
import { fetchAccounts } from '../slices/actions';
import FilterMenu from './FilterMenu';

const DashboardHeader = () => {
  const { filterCriteria } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const userId = userData?.user?.id;

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        if (userId) {
          const updatedFilter = {
            filters: filterCriteria.filters,
            search: value as string,
            userId,
          };
          // Save updated filter criteria to Redux state
          dispatch(setFilterCriteria(updatedFilter));
          // Fetch accounts with updated filter
          dispatch(fetchAccounts(updatedFilter));
        }
      }, 1000),

    [filterCriteria, userId],
  );

  const handleFilterChange = (newFilter: FilterCriteria) => {
    // Save filter criteria to Redux state
    dispatch(setFilterCriteria(newFilter));
    // Fetch accounts with new filter
    dispatch(fetchAccounts(newFilter));
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <div className="relative w-[30vw]">
          <Input
            title="Search"
            placeholder="Search"
            className="w-full"
            onChange={(e) => debouncedFilterHandler(e.target.value)}
            onBlur={() => debouncedFilterHandler.flush()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                debouncedFilterHandler.flush();
              }
            }}
          />
          <Search size={15} className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50" />
        </div>
        <CommonTooltip content="Filters">
          <div>
            <FilterMenu onFilterChange={handleFilterChange} filterCriteria={filterCriteria} />
          </div>
        </CommonTooltip>
      </div>
      <Link href="/account/create">
        <button
          data-test="dashboard-header-create-account"
          className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white"
        >
          <Icons.add className="h-6 w-6" />
        </button>
      </Link>
    </div>
  );
};

export default DashboardHeader;
