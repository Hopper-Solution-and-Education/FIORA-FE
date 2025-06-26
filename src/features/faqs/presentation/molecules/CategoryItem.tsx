import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import FaqsList from '../organisms/FaqsList';
import { CategoryWithFaqs } from '@/features/faqs/domain/repositories/IFaqsRepository';

interface CategoryItemProps {
  categoryGroup: CategoryWithFaqs;
  isExpanded: boolean;
  faqsToShow: any[];
  onShowMore: (categoryId: string) => void;
  isLoading?: boolean;
  faqsPerCategory: number;
}

const CategoryItem = ({
  categoryGroup,
  isExpanded,
  faqsToShow,
  onShowMore,
  isLoading = false,
  faqsPerCategory,
}: CategoryItemProps) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">{categoryGroup.categoryName}</h4>
        <span className="text-sm text-muted-foreground">{categoryGroup.totalFaqs} FAQs</span>
      </div>

      <FaqsList faqs={faqsToShow} isLoading={false} error="" />

      {categoryGroup.totalFaqs > faqsPerCategory && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => onShowMore(categoryGroup.categoryId)}
            className="text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            {isExpanded ? (
              <>
                Show Less
                <ChevronRight className="w-4 h-4 ml-1 rotate-90" />
              </>
            ) : (
              <>
                Show More ({categoryGroup.totalFaqs - faqsPerCategory} more)
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
