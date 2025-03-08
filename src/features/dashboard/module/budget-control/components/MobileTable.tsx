'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppDispatch } from '@/store';
import { MONTHS } from '../hooks/useBudgetControl';
import { handleBlur, handleEdit, toggleEdit } from '../slices/budgetSlice';
import { BudgetData } from '../types/budget';
import { EditableCell } from './EditableCell';

interface MobileTableProps {
  data: Pick<BudgetData, 'editableValues' | 'trueExpense'>;
  editing: { [key: string]: boolean };
  monthlyAmount: number;
}

export function MobileTable({ data, editing, monthlyAmount }: MobileTableProps) {
  const { editableValues, trueExpense } = data;
  const dispatch = useAppDispatch();

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Month</TableHead>
          <TableHead className="text-center">Planned</TableHead>
          <TableHead className="text-center">Actual</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MONTHS.map((month, index) => (
          <TableRow key={month}>
            <TableCell className="text-center">{month}</TableCell>
            <EditableCell
              value={editableValues[month] ?? monthlyAmount}
              onEdit={(value) => dispatch(handleEdit({ key: month, value, type: 'expense' }))}
              isEditing={!!editing[`mobile-expense-${month}`]}
              onToggleEdit={() => dispatch(toggleEdit(`mobile-expense-${month}`))}
              onBlur={() => dispatch(handleBlur(`mobile-expense-${month}`))}
            />
            <EditableCell
              value={trueExpense[index]}
              onEdit={(value) => dispatch(handleEdit({ key: index, value, type: 'expense' }))}
              isEditing={!!editing[`mobile-true-expense-${index}`]}
              onToggleEdit={() => dispatch(toggleEdit(`mobile-true-expense-${index}`))}
              onBlur={() => dispatch(handleBlur(`mobile-true-expense-${index}`))}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
