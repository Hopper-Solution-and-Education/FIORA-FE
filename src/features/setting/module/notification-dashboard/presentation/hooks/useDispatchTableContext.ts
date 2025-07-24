'use client';

import { useContext } from 'react';
import { DispatchTableContext } from '../context/DispatchTableContext';

export const useDispatchTableContext = () => {
  const context = useContext(DispatchTableContext);
  if (context === undefined) {
    throw new Error('useDispatchTableContext must be used within a DispatchTableProvider');
  }
  return context;
};
