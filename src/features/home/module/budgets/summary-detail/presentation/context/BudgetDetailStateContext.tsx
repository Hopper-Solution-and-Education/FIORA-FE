import { createContext, ReactNode, useContext } from 'react';
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

export const useBudgetDetailStateContext = () => {
  const context = useContext(BudgetDetailStateContext);
  if (!context) {
    throw new Error('useBudgetDetailStateContext must be used within a BudgetDetailStateProvider');
  }
  return context;
};
