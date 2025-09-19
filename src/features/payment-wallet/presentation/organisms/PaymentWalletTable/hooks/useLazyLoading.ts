import { RefObject, useEffect } from 'react';
import { PaginationParams } from '../types';

interface UseLazyLoadingProps {
  toggleRef: RefObject<HTMLDivElement | null>;
  displayDataLength: number;
  transactionsLoading: boolean;
  paginationParams: PaginationParams;
  loadMoreTransactions: () => void;
}

export const useLazyLoading = ({
  toggleRef,
  displayDataLength,
  transactionsLoading,
  paginationParams,
  loadMoreTransactions,
}: UseLazyLoadingProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !transactionsLoading &&
          paginationParams.currentPage < paginationParams.totalPage
        ) {
          if (paginationParams.currentPage < paginationParams.totalPage && !transactionsLoading) {
            loadMoreTransactions();
          }
        }
      },
      { threshold: 0.2 },
    );

    const currentToggleRef = toggleRef.current;
    if (currentToggleRef && displayDataLength >= 20) {
      observer.observe(currentToggleRef);
    }

    return () => {
      if (currentToggleRef) {
        observer.unobserve(currentToggleRef);
      }
    };
  }, [
    transactionsLoading,
    paginationParams.currentPage,
    paginationParams.totalPage,
    displayDataLength,
    loadMoreTransactions,
    toggleRef,
  ]);
};
