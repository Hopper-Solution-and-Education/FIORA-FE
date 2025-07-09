import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import FaqsList from './FaqsList';
import { CategoryWithFaqs } from '../../domain/entities/models/faqs';

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
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold">{categoryGroup.categoryName}</h4>
        {/* <span className="text-sm text-muted-foreground">{categoryGroup.totalFaqs} FAQs</span> */}
      </div>

      <FaqsList faqs={faqsToShow} isLoading={false} error="" />

      {categoryGroup.totalFaqs > faqsPerCategory && (
        <div className="mt-4 text-end">
          <Button
            variant="outline"
            onClick={() => onShowMore(categoryGroup.categoryId)}
            disabled={isLoading}
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
  );
};

export default CategoryItem;
