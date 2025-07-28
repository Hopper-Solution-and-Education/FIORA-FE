import { useContext } from 'react';
import { BudgetDetailStateContext } from '../context/BudgetDetailStateContext';

export const useBudgetDetailStateContext = () => {
  const context = useContext(BudgetDetailStateContext);
  if (!context) {
    throw new Error('useBudgetDetailStateContext must be used within a BudgetDetailStateProvider');
  }
  return context;
};
