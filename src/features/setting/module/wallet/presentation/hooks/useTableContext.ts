import { useContext } from 'react';
import { TableContext } from '../context';

export const useTableContext = () => {
  const context = useContext(TableContext);

  if (context === undefined) {
    throw new Error('useDispatchTableContext must be used within a DispatchTableProvider');
  }

  return context;
};
