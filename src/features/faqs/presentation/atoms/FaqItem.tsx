import { Faq } from '@/features/faqs/domain/entities/models/faqs';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface FaqItemProps {
  faq: Faq;
  className?: string;
  showCategory?: boolean;
}

const FaqItem = ({ faq, className, showCategory = false }: FaqItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/faqs/details/${faq.id}`);
  };

  return (
    <div
      className={cn(
        'cursor-pointer hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-md p-2',
        className,
      )}
      onClick={handleClick}
    >
      <div className="flex flex-row items-start justify-between p-2 space-y-0">
        <div className="flex-1 pr-4">
          <div className="text-base">{faq.title}</div>
        </div>
        {showCategory && (
          <div className="ml-2 font-normal text-xs px-2 py-1 shrink-0 border border-gray-200 rounded-md">
            {faq.category}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqItem;
