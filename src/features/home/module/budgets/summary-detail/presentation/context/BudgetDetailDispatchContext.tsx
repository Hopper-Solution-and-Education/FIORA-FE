import { createContext, Dispatch, ReactNode } from 'react';
import { BudgetDetailAction } from '../reducer/budgetDetailReducer';

interface BudgetDetailDispatchContextType {
  dispatch: Dispatch<BudgetDetailAction>;
}

export const BudgetDetailDispatchContext = createContext<
  BudgetDetailDispatchContextType | undefined
>(undefined);

interface BudgetDetailDispatchProviderProps {
  children: ReactNode;
  value: BudgetDetailDispatchContextType;
}

export const BudgetDetailDispatchProvider = ({
  children,
  value,
}: BudgetDetailDispatchProviderProps) => {
  return (
    <BudgetDetailDispatchContext.Provider value={value}>
      {children}
    </BudgetDetailDispatchContext.Provider>
  );
};
