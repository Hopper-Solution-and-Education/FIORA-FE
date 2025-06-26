'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FaqsListPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => {
        setFaqs(data.data || data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!faqs.length) return <div>No FAQs available.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">FAQs List</h1>
      <ul className="space-y-6">
        {faqs.map((faq) => (
          <li key={faq.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">
              <Link href={`/faqslist/${faq.id}`} className="text-blue-600 hover:underline">
                {faq.title}
              </Link>
            </h2>
            <div className="text-gray-600 mb-2">{faq.description}</div>
            <div className="prose" dangerouslySetInnerHTML={{ __html: faq.content }} />
            <div className="text-xs text-gray-400 mt-2">
              Category: {faq.PostCategory?.name || 'N/A'} | Views: {faq.views}
            </div>
            <div className="text-xs text-gray-400">
              By: {faq.User?.email || 'Unknown'} | {new Date(faq.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
