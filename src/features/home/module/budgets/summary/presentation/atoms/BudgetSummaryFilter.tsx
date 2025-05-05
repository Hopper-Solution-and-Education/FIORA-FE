'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface BudgetSummaryFilterProps {
  onFilter: (searchTerm: string) => void;
  initialValue?: string;
}

const BudgetSummaryFilter = ({ onFilter, initialValue = '' }: BudgetSummaryFilterProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSearch = () => {
    onFilter(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onFilter('');
  };

  return (
    <div className="flex items-center space-x-3 mb-4 justify-between w-full">
      <div className="flex flex-1 max-w-md">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Input text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-blue-500 transition-colors"
          >
            <Search className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        <Button
          onClick={handleSearch}
          variant="outline"
          size="icon"
          className="border border-gray-300 dark:border-gray-700 ml-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <Button
          onClick={handleClear}
          variant="outline"
          size="icon"
          className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BudgetSummaryFilter;
