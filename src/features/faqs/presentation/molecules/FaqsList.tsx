import { Faq } from '@/features/faqs/domain/entities/models/faqs';
import FaqItem from '../atoms/FaqItem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FaqsListProps {
  faqs: Faq[];
  isLoading: boolean;
  error?: string;
  showCategory?: boolean;
}

const FaqsList = ({ faqs, isLoading, error, showCategory = false }: FaqsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="w-full h-32" />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (faqs.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="mt-1">No FAQs Found</AlertTitle>
      </Alert>
    );
  }

  return (
    <div>
      {faqs.map((faq) => (
        <FaqItem key={faq.id} faq={faq} showCategory={showCategory} />
      ))}
    </div>
  );
};

export default FaqsList;
