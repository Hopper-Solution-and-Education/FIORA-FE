import { Post } from '../../domain/entities/models/faqs';
import FaqsList from '../molecules/FaqsList';

interface FilteredCategoriesSectionProps {
  categoriesWithFaqs: Post[];
  isLoading: boolean;
}

const FilteredCategoriesSection = ({
  categoriesWithFaqs,
  isLoading,
}: FilteredCategoriesSectionProps) => {
  if (categoriesWithFaqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No FAQs found</p>
      </div>
    );
  }

  const groupedFaqs = categoriesWithFaqs.reduce(
    (acc, faq) => {
      acc[faq.categoryId] = [...(acc[faq.categoryId] || []), faq];
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-center mb-8">FAQ Center</h2>
      <div className="space-y-6">
        {Object.entries(groupedFaqs).map(([category, faqs]) => (
          <div key={category} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">{category}</h4>
            </div>
            <FaqsList faqs={faqs} isLoading={isLoading} error="" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FilteredCategoriesSection;
