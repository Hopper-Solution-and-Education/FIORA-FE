import { TableCell, TableRow } from '@/components/ui/table';
import React from 'react';

interface TableEmptyStateProps {
  message: string;
  columns?: number;
  className?: string;
}

const TableEmptyState = ({ message, columns = 7, className }: TableEmptyStateProps) => {
  return (
    <TableRow className={className}>
      <TableCell colSpan={columns} className="text-center py-8 text-muted-foreground">
        {message}
      </TableCell>
    </TableRow>
  );
};

export default TableEmptyState;
