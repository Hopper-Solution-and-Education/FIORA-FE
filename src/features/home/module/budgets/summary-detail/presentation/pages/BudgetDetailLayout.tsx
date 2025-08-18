'use client';

import { useReducer } from 'react';
import { BudgetDetailDispatchProvider } from '../context/BudgetDetailDispatchContext';
import { BudgetDetailStateProvider } from '../context/BudgetDetailStateContext';
import { budgetDetailReducer, initialBudgetDetailState } from '../reducer/budgetDetailReducer';

interface BudgetsDetailLayoutProps {
  children: React.ReactNode;
}

export default function BudgetsDetailLayout({ children }: BudgetsDetailLayoutProps) {
  const [state, dispatch] = useReducer(budgetDetailReducer, initialBudgetDetailState);

  return (
    <BudgetDetailDispatchProvider value={{ dispatch }}>
      <BudgetDetailStateProvider value={{ state }}>
        <section className="sm:px-6 lg:px-8 h-full">
          <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <div className="flex-1">{children}</div>
          </div>
        </section>
      </BudgetDetailStateProvider>
    </BudgetDetailDispatchProvider>
  );
}
