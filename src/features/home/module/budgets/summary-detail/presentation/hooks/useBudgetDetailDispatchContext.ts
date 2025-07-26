import { useContext } from 'react';
import { BudgetDetailDispatchContext } from '../context/BudgetDetailDispatchContext';

export const useBudgetDetailDispatchContext = () => {
  const context = useContext(BudgetDetailDispatchContext);
  if (!context) {
    throw new Error(
      'useBudgetDetailDispatchContext must be used within a BudgetDetailDispatchProvider',
    );
  }
  return context;
};
