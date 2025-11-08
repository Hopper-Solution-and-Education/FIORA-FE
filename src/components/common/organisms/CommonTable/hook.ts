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
  deps = [],
}: UseCommonInfiniteScrollParams & { deps?: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const isFetching = useRef(false);

  useEffect(() => {
    isFetching.current = false;
    isInitialMount.current = true;
    const container = containerRef.current;
    if (container) container.scrollTop = 0;
  }, deps);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

    if (!hasMore || isLoadingMore || isFetching.current) return;

    if (scrollPercentage >= threshold) {
      isFetching.current = true;

      Promise.resolve(onLoadMore()).finally(() => {
        isFetching.current = false;
      });
    }
  }, [hasMore, isLoadingMore, onLoadMore, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !hasMore || isLoadingMore || isInitialMount.current) return;

    const { scrollHeight, clientHeight } = container;
    if (clientHeight >= scrollHeight) {
      onLoadMore();
    }
  }, [hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    if (!isLoadingMore) isInitialMount.current = false;
  }, [isLoadingMore]);

  return { containerRef } as const;
}
