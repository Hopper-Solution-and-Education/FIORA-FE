import FaqsList from '../organisms/FaqsList';
import CategoryChips from '../atoms/CategoryChips';
import FaqsSectionHeader from '../atoms/FaqsSectionHeader';

interface FaqsFilterResultsProps {
  faqs: any[];
  isLoading: boolean;
  selectedCategories: string[];
  displayText: string;
}

const FaqsFilterResults = ({
  faqs,
  isLoading,
  selectedCategories,
  displayText,
}: FaqsFilterResultsProps) => {
  return (
    <section>
      <FaqsSectionHeader
        title={displayText}
        subtitle={faqs.length > 0 ? `Found ${faqs.length}` : undefined}
        count={faqs.length > 0 ? faqs.length : undefined}
      />

      <CategoryChips categories={selectedCategories} />

      <FaqsList faqs={faqs} isLoading={isLoading} error="" />

      {faqs.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          No FAQs found matching your criteria. Try adjusting your search or filters.
        </div>
      )}
    </section>
  );
};

export default FaqsFilterResults;
