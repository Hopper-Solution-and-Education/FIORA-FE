import { createContext, ReactNode } from 'react';
import { BudgetDetailState } from '../reducer/budgetDetailReducer';

interface BudgetDetailStateContextType {
  state: BudgetDetailState;
}

export const BudgetDetailStateContext = createContext<BudgetDetailStateContextType | undefined>(
  undefined,
);

interface BudgetDetailStateProviderProps {
  children: ReactNode;
  value: BudgetDetailStateContextType;
}

export const BudgetDetailStateProvider = ({ children, value }: BudgetDetailStateProviderProps) => {
  return (
    <BudgetDetailStateContext.Provider value={value}>{children}</BudgetDetailStateContext.Provider>
  );
};
