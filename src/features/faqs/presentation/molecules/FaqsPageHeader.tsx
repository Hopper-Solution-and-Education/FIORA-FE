import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import FaqsFilter, { FaqsFilterValues } from './FaqsFilter';

interface FaqsPageHeaderProps {
  categories: string[];
  activeFilters: FaqsFilterValues;
  onFilterSubmit: (filters: FaqsFilterValues) => void;
  isLoading: boolean;
}

const FaqsPageHeader = ({
  categories,
  activeFilters,
  onFilterSubmit,
  isLoading,
}: FaqsPageHeaderProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center">How can we help?</h2>

      {/* Header with Filter and Import */}
      <div className="flex justify-between items-center">
        <FaqsFilter
          categories={categories}
          onFilterSubmit={onFilterSubmit}
          initialValues={activeFilters}
          isLoading={isLoading}
        />

        <Link href="/faqs/import" passHref>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Import FAQs
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FaqsPageHeader;
