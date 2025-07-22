import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { FAQ_LIST_CONSTANTS } from '../../constants';
import { FaqsCategoriesWithPostResponse } from '../../domain/entities/models/faqs';
import FaqsList from '../molecules/FaqsList';

interface CategoriesSectionProps {
  categoriesWithFaqs: FaqsCategoriesWithPostResponse[];
  expandedCategories: Set<string>;
  expandedCategoryFaqs: Record<string, any[]>;
  onShowMore: (categoryId: string) => void;
  isLoading: boolean;
}

const faqsPerCategory = FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY;

const CategoryCard = React.memo(
  ({
    category,
    isExpanded,
    faqsToShow,
    onShowMore,
    isLoading,
  }: {
    category: FaqsCategoriesWithPostResponse;
    isExpanded: boolean;
    faqsToShow: any[];
    onShowMore: (categoryId: string) => void;
    isLoading: boolean;
  }) =>
    faqsToShow.length > 0 ? (
      <div className="border rounded-lg p-4" key={category.id}>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold">{category.name}</h4>
        </div>
        <FaqsList faqs={faqsToShow} isLoading={false} error="" />
        {faqsToShow.length > faqsPerCategory && (
          <div className="mt-4 text-end">
            <Button
              variant="outline"
              onClick={() => onShowMore(category.id)}
              disabled={isLoading}
              aria-label={
                isExpanded
                  ? `Show less FAQs in ${category.name}`
                  : `Show more FAQs in ${category.name}`
              }
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    ) : null,
);
CategoryCard.displayName = 'CategoryCard';

const CategoriesSection = ({
  categoriesWithFaqs,
  expandedCategories,
  expandedCategoryFaqs,
  onShowMore,
  isLoading,
}: CategoriesSectionProps) => {
  if (isLoading && categoriesWithFaqs.length === 0) {
    return (
      <section>
        <div className="text-center py-8">
          <Skeleton className="w-full h-10" />
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="space-y-6">
        {categoriesWithFaqs.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const faqsToShow = isExpanded
            ? expandedCategoryFaqs[category.id] || category.faqs
            : category.faqs;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={isExpanded}
              faqsToShow={faqsToShow}
              onShowMore={onShowMore}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
