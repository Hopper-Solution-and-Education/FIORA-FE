import { RefObject, useEffect } from 'react';

export function useInfiniteObserver(
  containerRef: RefObject<HTMLElement>,
  sentinelRef: RefObject<HTMLElement>,
  onHitBottom: () => void,
) {
  useEffect(() => {
    const root = containerRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onHitBottom();
      },
      { root, rootMargin: '0px 0px 200px 0px', threshold: 0.01 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [containerRef, sentinelRef, onHitBottom]);
}
