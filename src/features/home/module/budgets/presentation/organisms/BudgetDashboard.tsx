'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import StackedBarChart from '@/components/common/stacked-bar-chart';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { legendItems, mapBudgetToData } from '../../utils';
import { BudgetGetFormValues } from '../schema';

const BudgetDashboard = () => {
  const currency = useAppSelector((state) => state.settings.currency);
  const { budgets, isLoading, nextCursor, isLast } = useAppSelector(
    (state) => state.budgetControl.getBudget,
  );
  const methods = useFormContext<BudgetGetFormValues>();

  const { watch } = methods;

  const dispatch = useAppDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
              lte: Number(watch('toYear')),
              gte: Number(watch('fromYear')),
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

    [isLast, isLoading],
  );

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

  return (
    <div ref={scrollRef} className="overflow-auto min-h-screen">
      <div>
        {isLoading && !budgets.length ? (
          // Show skeletons while loading and no data
          Array.from({ length: 3 }).map((_, index) => (
            <ChartSkeleton key={index} className="h-[300px] w-full my-16" />
          ))
        ) : budgets.length === 0 ? (
          // Show empty state when no budgets are available
          <div className="flex flex-col items-center justify-center h-[300px] my-16 text-center">
            <p className="text-lg font-medium text-gray-500">No budgets found.</p>
            <p className="text-sm text-gray-400">
              Try adjusting your search or adding a new budget.
            </p>
          </div>
        ) : (
          // Render budget charts
          budgets.map((budgetItem) => {
            const data = mapBudgetToData(budgetItem);
            return (
              <StackedBarChart
                key={budgetItem.year}
                data={data}
                title={`${budgetItem.year}`}
                currency={currency}
                tutorialText="Click on a bar to view details."
                className="my-4"
                legendItems={legendItems}
              />
            );
          })
        )}
      </div>
      {!isLast && (
        <div ref={sentinelRef} className="h-10">
          {isLoading && <ChartSkeleton className="h-[300px] w-full" />}
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;
