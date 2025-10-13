import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Input } from '@/components/ui/input';
import { updateProductFilterCriteria } from '@/features/setting/module/product/slices';
import { getProductTransactionAsyncThunk } from '@/features/setting/module/product/slices/actions';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import FilterMenu from './FilterMenu';

export const DashboardHeading: React.FC = () => {
  const { filterCriteria, productTransaction } = useAppSelector((state) => state.productManagement);
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const userId = userData?.user?.id;

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        if (value.trim() === '') {
          return;
        }
        if (userId) {
          dispatch(
            getProductTransactionAsyncThunk({
              page: 1,
              pageSize: productTransaction.pageSize || 1,
              filters: filterCriteria.filters,
              search: value as string,
              userId,
            }),
          );
        }
      }, 1000),

    [filterCriteria, productTransaction.pageSize, userId],
  );

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(updateProductFilterCriteria(newFilter));
  };

  return (
    <div className="flex gap-4">
      <div className="relative w-[30vw]">
        <Input
          title="Search"
          placeholder="Search"
          className="w-full"
          maxLength={50}
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
  );
};
