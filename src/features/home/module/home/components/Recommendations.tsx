'use client';

import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/shared/utils';
import { useAppSelector } from '@/store';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useCallback, useState } from 'react';
import NavigateDialog from './NavigateDialog';

interface Recommendation {
  id: string;
  userId: string | null;
  title: string;
  description: string;
  link: string;
  amount?: number;
  currency?: string;
  attachments: any[];
}

const recommendations: Recommendation[] = [
  {
    id: 'rec-1',
    userId: null,
    title: 'Invest Your Savings',
    description: 'You have about 9K free which could be staked into a saving to generate interest.',
    link: '#',
    amount: 9000, // Parsed from '9K'
    currency: 'USD',
    attachments: [],
  },
  {
    id: 'rec-2',
    userId: null,
    title: 'Maximize Your Portfolio',
    description: 'Consider diversifying your assets for better returns.',
    link: '#',
    attachments: [],
  },
];

function RecommendationSkeleton() {
  return (
    <div className="border rounded-lg p-3 animate-pulse">
      <div className="flex-1 mb-3 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function Recommendations() {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const selectedCurrency = useAppSelector((state) => state.settings.currency);

  // Static exchange rates (replace with API in production)
  const exchangeRates: Record<string, number> = {
    VND: 1, // Base currency
    USD: 1 / 25000, // 1 USD = 25,000 VND
  };

  const onConfirm = () => {
    redirect('/recommendations');
  };

  const handleClickRecommendationsPage = useCallback(() => {
    setIsShowDialog(true);
  }, []);

  // Simulate loading state (replace with useDataFetcher for real data)
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] border rounded-md border-gray-100 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {[...Array(3)].map((_, idx) => (
            <RecommendationSkeleton key={idx} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={handleClickRecommendationsPage}
        className="h-[350px] md:h-[400px] lg:h-[500px] border rounded-md border-gray-100 p-4 shadow-sm cursor-pointer relative"
        role="region"
        aria-label="Recommendations"
        tabIndex={0}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold text-lg">Recommendations</div>
        </div>
        <div
          className={cn(
            'overflow-y-auto max-h-[calc(100%-2rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
            recommendations.length > 0 && 'pr-2',
          )}
        >
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec) => {
                // Convert amount if currencies differ
                let displayAmount = rec.amount ?? 0;
                let displayCurrency = rec.currency || 'VND';
                if (rec.amount && selectedCurrency !== displayCurrency) {
                  if (exchangeRates[displayCurrency] && exchangeRates[selectedCurrency]) {
                    displayAmount =
                      (rec.amount * exchangeRates[selectedCurrency]) /
                      exchangeRates[displayCurrency];
                    displayCurrency = selectedCurrency;
                  }
                }
                const formattedAmount = rec.amount
                  ? formatCurrency(displayAmount, displayCurrency)
                  : null;

                return (
                  <div
                    key={rec.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex-1 mb-3">
                      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formattedAmount
                          ? rec.description.replace('9K', formattedAmount)
                          : rec.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <Button
                        asChild
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold text-sm"
                      >
                        <Link href={rec.link}>Explore</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold text-sm"
                      >
                        <Link href={rec.link}>Apply</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">No recommendations found.</div>
          )}
        </div>
        {recommendations.length > 5 && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none" />
        )}
      </div>
      <NavigateDialog
        title="View Recommendation"
        description="You are about to navigate to the Recommendation Page"
        isOpen={isShowDialog}
        onClose={() => setIsShowDialog(false)}
        onConfirm={onConfirm}
      />
    </>
  );
}
