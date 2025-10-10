import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';
import { Search, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FaqsCategoriesResponse } from '../../domain/entities/models/faqs';
import FaqsFilterMenu from '../molecules/FaqsFilterMenu';

export interface FaqsFilterValues {
  search: string;
  categories: string[];
}

interface FaqsPageHeaderProps {
  categories: FaqsCategoriesResponse[];
  activeFilters: FaqsFilterValues;
  onFilterChange: (filters: FaqsFilterValues) => void;
  isLoading: boolean;
  isAdminOrCS: boolean;
}

const FaqsPageHeader = ({
  categories,
  activeFilters,
  onFilterChange,
  isLoading,
  isAdminOrCS,
}: FaqsPageHeaderProps) => {
  const router = useRouter();

  const debouncedSearchHandler = useMemo(
    () =>
      debounce((value: string) => {
        const updatedFilters: FaqsFilterValues = {
          ...activeFilters,
          search: value,
        };
        onFilterChange(updatedFilters);
      }, 1000),
    [activeFilters, onFilterChange],
  );

  const handleFilterMenuChange = (filters: FaqsFilterValues) => {
    onFilterChange(filters);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">How can we help?</h2>

      {/* Header with Filter and Import */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative w-[30vw]">
            <Input
              title="Search"
              placeholder="Search FAQs..."
              className="w-full"
              onChange={(e) => debouncedSearchHandler(e.target.value)}
              onBlur={() => debouncedSearchHandler.flush()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  debouncedSearchHandler.flush();
                }
              }}
              disabled={isLoading}
            />
            <Search
              size={15}
              className="absolute top-[50%] right-2 -translate-y-[50%] opacity-50"
            />
          </div>
          <CommonTooltip content="Filters">
            <div>
              <FaqsFilterMenu
                categories={categories}
                activeFilters={activeFilters}
                onFilterChange={handleFilterMenuChange}
              />
            </div>
          </CommonTooltip>
        </div>

        {isAdminOrCS && (
          <div className="flex gap-2">
            <CommonTooltip content="Import FAQs">
              <Button
                onClick={() => router.push('/helps-center/faqs/import')}
                className="px-3 py-2"
                variant="outline"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </CommonTooltip>

            <CommonTooltip content="Create FAQ">
              <Button
                onClick={() => router.push('/helps-center/faqs/create')}
                className="px-3 py-2 bg-green-200 hover:bg-green-500 border-green-600"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                    fill="#000000"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </CommonTooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqsPageHeader;
