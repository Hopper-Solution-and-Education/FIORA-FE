'use client';

import ActionButton from '@/components/common/UIKit/Button/ActionButton';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useAppDispatch, useAppSelector } from '@/store';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { TabActionHeaderProps } from '../../../../presentation/types';
import { updatePartnerFilterCriteria } from '../../slices';
import { searchPartners } from '../../slices/actions/searchPartnersAsyncThunk';
import FilterMenu from './FilterMenu';

export const TabActionHeader = ({ buttonLabel, redirectPath }: TabActionHeaderProps) => {
  const router = useRouter();
  const { filterCriteria } = useAppSelector((state) => state.partner);
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const userId = userData?.user?.id;

  const debouncedFilterHandler = useMemo(
    () =>
      debounce((value: string) => {
        if (userId) {
          dispatch(
            searchPartners({
              search: value as string,
              filters: filterCriteria.filters,
            }),
          );
        }
      }, 1000),
    [filterCriteria, userId, dispatch],
  );

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(updatePartnerFilterCriteria(newFilter));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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
            <Search
              size={15}
              className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50"
            />
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

        {buttonLabel ? (
          <ActionButton
            tooltipContent={buttonLabel}
            onClick={() => redirectPath && router.push(redirectPath)}
          />
        ) : (
          <ActionButton />
        )}
      </div>

      <Separator />
    </div>
  );
};
