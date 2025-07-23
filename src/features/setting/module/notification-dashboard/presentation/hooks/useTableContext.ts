'use client';

import { useContext } from 'react';
import { TableContext } from '../context/TableContext';

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
};
