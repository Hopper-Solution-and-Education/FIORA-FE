import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { updateProductFilterCriteria } from '@/features/setting/module/product/slices';
import { getProductsAsyncThunk } from '@/features/setting/module/product/slices/actions/getProductsAsyncThunk';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import FilterMenu from './FilterMenu';

export const DashboardHeading: React.FC = () => {
  const { filterCriteria, products } = useAppSelector((state) => state.productManagement);
  const dispatch = useAppDispatch();

  // Fetch products when component mounts
  useEffect(() => {
    dispatch(getProductsAsyncThunk({ page: 1, pageSize: 100 }));
  }, [dispatch]);

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

  // Create product options from fetched products
  const productOptions = useMemo(() => {
    return products.items.map((product) => ({
      value: product.id,
      label: product.name,
      icon: product.icon,
    }));
  }, [products.items]);

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
