'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const recommendations = [
  {
    id: 'rec-1',
    userId: null,
    title: 'Invest Your Savings',
    description: 'You have about 9K free which could be staked into a saving to generate interest.',
    link: '#',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-biyr4mO-BnQ3or0X1ROmQf92qu1h1_k4sg&s',
    attachments: [],
  },
  {
    id: 'rec-2',
    userId: null,
    title: 'Maximize Your Portfolio',
    description: 'Consider diversifying your assets for better returns.',
    link: '#',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-biyr4mO-BnQ3or0X1ROmQf92qu1h1_k4sg&s',
    attachments: [],
  },
];

export default function Recommendations() {
  return (
    <div className="space-y-3">
      {recommendations.length === 0 ? (
        <div className="p-4 text-center border rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            There are no recommendations at this moment!
          </p>
        </div>
      ) : (
        recommendations.map((rec, index) => (
          <div key={rec.id} className="border-b py-3">
            <div className="flex items-center last:border-none space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <div className="w-20 h-20 flex-shrink-0 relative rounded-md overflow-hidden">
                <Image src={rec.image} alt={rec.title} fill className="object-cover" />
              </div>

              <div className="flex-1">
                <Badge variant="secondary">Suggestion #{index + 1}</Badge>
                <h3 className="text-md font-semibold">{rec.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
              </div>
            </div>
            <div className="flex justify-between px-2 items-center">
              <Button asChild variant="outline" className="text-blue-600 font-semibold text-sm">
                <Link href={rec.link}>Explore</Link>
              </Button>
              <Button asChild variant="outline" className="text-blue-600 font-semibold text-sm">
                <Link href={rec.link}>Apply</Link>
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
