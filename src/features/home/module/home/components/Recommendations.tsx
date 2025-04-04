'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

const recommendations = [
  {
    id: 'rec-1',
    userId: null,
    title: 'Invest Your Savings',
    description: 'You have about 9K free which could be staked into a saving to generate interest.',
    link: '#',
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

export default function Recommendations() {
  return (
    <div className="h-[200px] sm:h-[320px] md:h-[440px] lg:h-[600px] overflow-y-auto">
      <div className="font-bold text-lg mb-3">Recommendations</div>
      {recommendations.length === 0 ? (
        <div className="p-4 text-center border rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            There are no recommendations at this moment!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex-1 mb-3">
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  {rec.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rec.description}</p>
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
          ))}
        </div>
      )}
    </div>
  );
}
