'use client';
import { SearchBar } from '@/components/common/organisms';
import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const BudgetDashboardPage = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Search Bar on the Left */}
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search budgets..."
          leftIcon={<Search className="h-5 w-5 text-gray-500" />}
          rightIcon={
            searchValue ? (
              <X
                className="h-5 w-5 text-gray-500 cursor-pointer"
                onClick={() => setSearchValue('')}
              />
            ) : null
          }
          showFilter
          filterContent={
            <div>
              <h3 className="font-semibold mb-2">Filter Budgets</h3>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Active Budgets
              </label>
              <label className="flex items-center mt-2">
                <input type="checkbox" className="mr-2" />
                Archived Budgets
              </label>
            </div>
          }
          className="max-w-md"
          inputClassName="border-gray-300"
          dropdownPosition={{
            side: 'bottom',
          }}
        />

        <Link href="/budgets/create">
          <Tooltip>
            <TooltipTrigger>
              <button className="p-2 mb-4 rounded-full bg-blue-500 hover:bg-blue-700 text-white">
                <Icons.add className="h-6 w-6" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Create Budget</TooltipContent>
          </Tooltip>
        </Link>
      </div>

      {/* Placeholder for Budget Dashboard Content */}
      <div>BudgetDashboardPage Content</div>
    </div>
  );
};

export default BudgetDashboardPage;
