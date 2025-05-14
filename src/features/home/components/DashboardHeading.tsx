import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { updateProductFilterCriteria } from '@/features/setting/module/product/slices';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useMemo } from 'react';
import FilterMenu from './FilterMenu';

export const DashboardHeading: React.FC = () => {
  const { filterCriteria } = useAppSelector((state) => state.productManagement);
  const dispatch = useAppDispatch();

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        handleFilterChange({ ...filterCriteria, search: value as string });
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterCriteria],
  );

  // useEffect(() => {
  //     if (fetchData) {
  //       mutate('/api/transactions', displayData, {
  //         revalidate: true,
  //       });
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [paginationParams.currentPage, filterCriteria]);

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(updateProductFilterCriteria(newFilter));
  };

  // Mock product options - in a real app, this would come from an API
  const productOptions = [
    { value: 'Product A', label: 'Product A' },
    { value: 'Product B', label: 'Product B' },
    { value: 'Product C', label: 'Product C' },
  ];

  return (
    <div className="flex gap-4">
      <div className="relative w-[30vw]">
        <Input
          title="Search"
          placeholder="Search"
          className="w-full"
          onChange={(e) => debouncedFilterHandler(e.target.value)}
          onBlur={() => debouncedFilterHandler.flush()}
        />
        <Search size={15} className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50" />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <FilterMenu
                onFilterChange={handleFilterChange}
                filterCriteria={filterCriteria}
                productOptions={productOptions}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filters</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
