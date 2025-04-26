'use client';

import { ChartSkeleton } from '@/components/common/organisms';
import StackedBarChart from '@/components/common/stacked-bar-chart';
import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { getBudgetAsyncThunk } from '../../slices/actions/getBudgetAsyncThunk';
import { legendItems, mapBudgetToData } from '../../utils';

type Props = {
  search?: string;
};

const BudgetDashboard = ({ search = '' }: Props) => {
  const router = useRouter();
  const currency = useAppSelector((state) => state.settings.currency);
  const { budgets, isLoading, nextCursor, isLast } = useAppSelector(
    (state) => state.budgetControl.getBudget,
  );

  console.log(search);

  const dispatch = useAppDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleItemClick = useCallback(
    (item: CustomBarItem) => {
      router.push(`/budgets/${item.id}`);
    },
    [router],
  );

  const handleCallGetBudget = useCallback(
    (cursor: number | null) => {
      if (isLast || isLoading) return;
      const scrollPosition = scrollRef.current?.scrollTop || window.scrollY;
      dispatch(
        getBudgetAsyncThunk({
          cursor,
          search: '',
          take: 3,
        }),
      ).then(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollPosition;
        } else {
          window.scrollTo(0, scrollPosition);
        }
      });
    },
    [dispatch, isLast, isLoading],
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
        {isLoading && !budgets.length
          ? Array.from({ length: 3 }).map((_, index) => (
              <ChartSkeleton key={index} className="h-[300px] w-full my-16" />
            ))
          : budgets?.map((budgetItem) => {
              const data = mapBudgetToData(budgetItem);
              return (
                <StackedBarChart
                  key={budgetItem.year}
                  data={data}
                  title={`${budgetItem.year}`}
                  currency={currency}
                  locale="en-US"
                  onItemClick={handleItemClick}
                  xAxisFormatter={(value) => `$${value.toLocaleString()}`}
                  tutorialText="Click on a bar to view details."
                  showExpandCollapse={true}
                  maxItems={5}
                  className="my-4"
                  legendItems={legendItems}
                />
              );
            })}
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
