'use client';

import { useEffect, useRef } from 'react';

interface UseReferralTransactionInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

export const useReferralTransactionInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoadingMore,
}: UseReferralTransactionInfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoadingMore) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const threshold = 100; // Load more when 100px from bottom

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore, isLoadingMore]);

  return containerRef;
};
