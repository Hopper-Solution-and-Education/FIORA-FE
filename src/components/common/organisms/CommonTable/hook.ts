import { useCallback, useEffect, useRef } from 'react';

type UseCommonInfiniteScrollParams = {
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  threshold?: number;
};

export function useCommonInfiniteScroll({
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  threshold = 0.8,
}: UseCommonInfiniteScrollParams) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isFetching = useRef(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !hasMore || isLoadingMore || isFetching.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (scrollPercentage >= threshold) {
      isFetching.current = true;
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    // Reset fetching state when loading completes
    if (!isLoadingMore) {
      isFetching.current = false;
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      isFetching.current = false;
    };
  }, [handleScroll, isLoadingMore]);

  // Initial check in case content is less than container height
  useEffect(() => {
    if (!containerRef.current || !hasMore || isLoadingMore || isInitialMount.current) return;

    const container = containerRef.current;
    const { scrollHeight, clientHeight } = container;

    if (clientHeight >= scrollHeight * threshold) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore, threshold]);

  // Reset initial mount flag when data finishes loading (isLoadingMore becomes false)
  useEffect(() => {
    if (!isLoadingMore) {
      isInitialMount.current = false;
    }
  }, [isLoadingMore]);

  return { containerRef } as const;
}
