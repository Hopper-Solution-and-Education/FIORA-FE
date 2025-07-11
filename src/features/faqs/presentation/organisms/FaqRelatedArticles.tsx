import React from 'react';
import { Faq } from '../../domain/entities/models/faqs';
import FaqItem from '../atoms/FaqItem';

interface FaqRelatedArticlesProps {
  includedArticles?: Faq[];
  className?: string;
}

const FaqRelatedArticles: React.FC<FaqRelatedArticlesProps> = ({
  includedArticles,
  className = '',
}) => {
  if (!includedArticles || includedArticles.length === 0) {
    return null;
  }

  return (
    <div className={`p-6 rounded-xl mt-10 ${className} border border-gray-200`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Related Articles</h2>
      </div>

      <div className="space-y-2">
        {includedArticles.map((article) => (
          <FaqItem key={article.id} faq={article} showCategory={false} />
        ))}
      </div>
    </div>
  );
};

export default FaqRelatedArticles;
