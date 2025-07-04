'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

const FaqsPageRender = dynamic(() => import('@/features/faqs/FaqsPage'), {
  loading: () => <Loading />,
});

const FaqsPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('faq_create_success') === '1') {
        setShowSuccess(true);
        localStorage.removeItem('faq_create_success');
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  }, []);

  return (
    <>
      {showSuccess && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-start gap-2 bg-white border border-green-300 rounded-lg shadow-md px-4 py-3"
          style={{ minWidth: 260, borderBottom: '3px solid #22c55e' }}
        >
          <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-black">Post successful</div>
            <div className="text-xs text-gray-500">Create FAQ success</div>
          </div>
        </div>
      )}
      <div className="p-6">
        <FaqsPageRender />
      </div>
    </>
  );
};

export default FaqsPage;
