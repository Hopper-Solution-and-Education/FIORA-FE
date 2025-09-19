'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useCallback, useEffect, useRef } from 'react';
import { NewsResponse } from '../../api/types/newsDTO';
import Card from '../molecules/Card';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
  </div>
);

type Post = NewsResponse;

const CardList = ({
  newsList = [],
  isLoading,
  isFetchingPage,
  endOfNews,
  handleLoadMoreNews,
}: {
  newsList: Post[];
  isLoading: boolean;
  isFetchingPage: boolean;
  endOfNews: boolean;
  handleLoadMoreNews: () => void;
}) => {
  if (isLoading && newsList.length === 0) {
    return (
      <section>
        <div className="text-center py-8">
          <Skeleton className="w-full h-10" />
        </div>
      </section>
    );
  }

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const onIntersect: IntersectionObserverCallback = useCallback(
    (entries) => {
      if (endOfNews) {
        return;
      }
      const e = entries[0];
      if (e.isIntersecting && !isFetchingPage && !isLoading) {
        handleLoadMoreNews();
      }
    },
    [handleLoadMoreNews],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });
    io.observe(node);
    return () => {
      io.disconnect();
    };
  }, [onIntersect]);

  return (
    <div className="flex flex-col gap-5">
      {newsList.map((post) => (
        <Card key={post.id} {...post} />
      ))}

      <div ref={sentinelRef} />
      {/* Show loading spinner while fetching */}
      {isFetchingPage && <LoadingSpinner />}

      {/* Show end message when there are no more posts */}
      {endOfNews && newsList.length > 0 && (
        <p className="text-center text-slate-500 mt-4">You&apos;ve reached the end! 👋</p>
      )}
    </div>
  );
};

export default CardList;
