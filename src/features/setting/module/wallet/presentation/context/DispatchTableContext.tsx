'use client';

import { createContext, Dispatch, ReactNode } from 'react';
import { TableAction } from '../types';

interface DispatchTableContextType {
  dispatchTable: Dispatch<TableAction>;
  reloadData: () => Promise<void>;
}

export const DispatchTableContext = createContext<DispatchTableContextType | undefined>(undefined);

interface DispatchTableProviderProps {
  children: ReactNode;
  value: DispatchTableContextType;
}

export const DispatchTableProvider = ({ children, value }: DispatchTableProviderProps) => {
  return <DispatchTableContext.Provider value={value}>{children}</DispatchTableContext.Provider>;
};
