import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppDispatch } from '@/store';
import { useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { fetchCategories } from '../slices/actions';
import { TooltipContent } from '@/components/ui/tooltip';
import { FilterCriteria } from '@/shared/types';
import { TooltipProvider } from '@/components/ui/tooltip';
import FilterMenu from './FilterMenu';
import { ButtonCreation } from '@/components/common/atoms';
import { useRouter } from 'next/navigation';

const DashboardHeading = () => {
  const { filterCriteria } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const userId = userData?.user?.id;
  const router = useRouter();

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        if (userId) {
          dispatch(
            fetchCategories({
              filters: filterCriteria.filters,
              search: value as string,
              userId,
            }),
          );
        }
      }, 1000),

    [filterCriteria, userId],
  );

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(fetchCategories(newFilter));
  };

  const handleCreateCategory = () => {
    router.push('/category/create');
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <FilterMenu onFilterChange={handleFilterChange} filterCriteria={filterCriteria} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filters</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ButtonCreation
        action={handleCreateCategory}
        toolTip="Create New Category"
        variant="primary"
        size="icon"
        icon="add"
        ariaLabel="Create new category"
      />
    </div>
  );
};

export default DashboardHeading;
