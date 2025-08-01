'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Column configuration type
type ColumnConfig = {
  key: string;
  label: string;
  width?: string;
};

interface ValidationTableHeaderProps {
  columns: readonly ColumnConfig[];
}

const ValidationTableHeader = ({ columns }: ValidationTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      {columns.map((column) => (
        <TableHead key={column.key} className={column.width}>
          {column.label}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
);

export default ValidationTableHeader;
