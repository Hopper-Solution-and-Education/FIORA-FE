import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { getBudgetAsyncThunk } from '../../slices/actions';
import { BudgetGetFormValues } from '../schema';
import { useRouter } from 'next/navigation';

export const useBudgetDashboardLogic = () => {
  const dispatch = useAppDispatch();
  const methods = useFormContext<BudgetGetFormValues>();
  const { watch } = methods;
  const { isLast, isLoading, currency, nextCursor } = useAppSelector(
    (state) => state.budgetControl.getBudget,
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Handle call get budget
  const handleCallGetBudget = useCallback(
    (cursor: number | null) => {
      if (isLast || isLoading) return;
      const scrollPosition = scrollRef.current?.scrollTop || window.scrollY;

      dispatch(
        getBudgetAsyncThunk({
          cursor,
          search: '',
          take: 3,
          filters: {
            fiscalYear: {
              lte: Number(watch('toYear') ?? 9999),
              gte: Number(watch('fromYear') ?? 0),
            },
          },
          currency,
        }),
      ).then(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollPosition;
        } else {
          window.scrollTo(0, scrollPosition);
        }
      });
    },

    [currency, isLast, isLoading],
  );

  // Handle on click item
  const handleOnClickItem = useCallback((year: number) => {
    router.push(`/budgets/summary/${year}`);
  }, []);

  useEffect(() => {
    if (isLast || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleCallGetBudget(nextCursor);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px',
      },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [nextCursor, isLast, isLoading, handleCallGetBudget]);

  return {
    sentinelRef,
    scrollRef,
    handleCallGetBudget,
    handleOnClickItem,
  };
};
