'use client';

import { createContext, ReactNode } from 'react';
import { TableState } from '../types';

interface TableContextType {
  table: TableState;
}

export const TableContext = createContext<TableContextType | undefined>(undefined);

interface TableProviderProps {
  children: ReactNode;
  value: TableContextType;
}

export const TableProvider = ({ children, value }: TableProviderProps) => {
  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
};
