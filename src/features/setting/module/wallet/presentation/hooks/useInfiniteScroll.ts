'use client';

import { useCallback, useEffect, useRef } from 'react';
import { WALLET_SETTING_CONSTANTS } from '../../data';

interface UseInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  threshold?: number;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoadingMore,
  threshold = WALLET_SETTING_CONSTANTS.INFINITE_SCROLL_THRESHOLD,
}: UseInfiniteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= threshold) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return containerRef;
};
