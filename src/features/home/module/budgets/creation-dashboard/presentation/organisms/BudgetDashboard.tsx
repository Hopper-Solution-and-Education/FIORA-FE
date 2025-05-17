'use client';

import { StackedBarChartSkeleton } from '@/components/common/organisms';
import PositiveNegativeStackBarChart from '@/components/common/charts/positive-negative-stack-bar-chart';
import { useAppSelector } from '@/store';
import { legendItems, mapBudgetToData } from '../../utils';
import { useBudgetDashboardLogic } from '../hooks';

const BudgetDashboard = () => {
  const currency = useAppSelector((state) => state.settings.currency);
  const {
    budgets,
    isLoading,
    isLast,
    currency: budgetCurrency,
  } = useAppSelector((state) => state.budgetControl.getBudget);

  const { scrollRef, handleOnClickItem, sentinelRef } = useBudgetDashboardLogic();

  return (
    <div ref={scrollRef} className="overflow-hidden min-h-screen">
      <div>
        {isLoading && !budgets.length ? (
          // Show skeletons while loading and no data
          Array.from({ length: 3 }).map((_, index) => (
            <StackedBarChartSkeleton key={index} className="h-[300px] w-full my-4" />
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
            const data = mapBudgetToData(budgetItem, budgetCurrency, currency);
            return (
              <div
                key={budgetItem.year}
                className="cursor-pointer"
                onClick={() => handleOnClickItem(budgetItem.year)}
              >
                <PositiveNegativeStackBarChart
                  data={data}
                  title={`${budgetItem.year}`}
                  currency={currency}
                  tutorialText="Click on a bar to view details."
                  className="my-4"
                  legendItems={legendItems}
                  callback={() => handleOnClickItem(budgetItem.year)}
                />
              </div>
            );
          })
        )}
      </div>
      {!isLast && (
        <div ref={sentinelRef} className="h-10">
          {isLoading && <StackedBarChartSkeleton />}
        </div>
      )}
    </div>
  );
};

export default BudgetDashboard;
