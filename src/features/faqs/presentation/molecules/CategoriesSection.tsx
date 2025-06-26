import { CategoryWithFaqs } from '@/features/faqs/domain/repositories/IFaqsRepository';
import FaqsSectionHeader from '../atoms/FaqsSectionHeader';
import CategoryItem from './CategoryItem';

interface CategoriesSectionProps {
  categoriesWithFaqs: CategoryWithFaqs[];
  expandedCategories: Set<string>;
  expandedCategoryFaqs: Record<string, any[]>;
  onShowMore: (categoryId: string) => void;
  isLoading: boolean;
  faqsPerCategory: number;
}

const CategoriesSection = ({
  categoriesWithFaqs,
  expandedCategories,
  expandedCategoryFaqs,
  onShowMore,
  isLoading,
  faqsPerCategory,
}: CategoriesSectionProps) => {
  return (
    <section>
      <FaqsSectionHeader title="Browse by Category" />

      {isLoading && categoriesWithFaqs.length === 0 ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : (
        <div className="space-y-6">
          {categoriesWithFaqs.map((categoryGroup) => {
            const isExpanded = expandedCategories.has(categoryGroup.categoryId);
            const faqsToShow = isExpanded
              ? expandedCategoryFaqs[categoryGroup.categoryId] || categoryGroup.faqs
              : categoryGroup.faqs;

            return (
              <CategoryItem
                key={categoryGroup.categoryId}
                categoryGroup={categoryGroup}
                isExpanded={isExpanded}
                faqsToShow={faqsToShow}
                onShowMore={onShowMore}
                isLoading={isLoading}
                faqsPerCategory={faqsPerCategory}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategoriesSection;
