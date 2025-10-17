import { useEffect, useRef } from 'react';

type UseCommonInfiniteScrollParams = {
  onLoadMore: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  rootMargin?: string;
};

export function useCommonInfiniteScroll({
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  rootMargin = '200px',
}: UseCommonInfiniteScrollParams) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isLoadingMore) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { root: containerRef.current || null, rootMargin },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore, rootMargin]);

  return { containerRef, sentinelRef } as const;
}
