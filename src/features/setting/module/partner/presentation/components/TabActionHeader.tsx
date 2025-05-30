'use client';

import { Icons } from '@/components/Icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { FilterCriteria } from '@/shared/types/filter.types';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { TabActionHeaderProps } from '../../../../presentation/types';
import { searchPartners } from '../../slices/actions/searchPartnersAsyncThunk';
import { updatePartnerFilterCriteria } from '../../slices';
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

  const buttonContent = (
    <>
      <Icons.add className="h-6 w-6" />
      {buttonLabel && <span className="ml-2">{buttonLabel}</span>}
    </>
  );

  const button = (
    <button
      onClick={() => router.push(redirectPath)}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'bg-blue-500 hover:bg-blue-700 text-white',
        'p-2 text-base rounded-full',
      )}
      aria-label={buttonLabel || 'Add new'}
    >
      {buttonContent}
    </button>
  );

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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="top">{buttonLabel}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          button
        )}
      </div>

      <Separator />
    </div>
  );
};
