'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MONTHS } from '../hooks/useBudgetControl';
import { BudgetActions, BudgetData } from '../types/budget';
import { EditableCell } from './EditableCell';

interface MobileTableProps {
  data: Pick<BudgetData, 'editableValues' | 'trueExpense'>;
  actions: Pick<BudgetActions, 'handleEdit' | 'toggleEdit' | 'handleBlur'>;
  editing: { [key: string]: boolean };
  monthlyAmount: number;
}

export function MobileTable({ data, actions, editing, monthlyAmount }: MobileTableProps) {
  const { editableValues, trueExpense } = data;
  const { handleEdit, toggleEdit, handleBlur } = actions;

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
              onEdit={(value) => handleEdit(month, value)}
              isEditing={!!editing[`mobile-expense-${month}`]}
              onToggleEdit={() => toggleEdit(`mobile-expense-${month}`)}
              onBlur={() => handleBlur(`mobile-expense-${month}`)}
            />
            <EditableCell
              value={trueExpense[index]}
              onEdit={(value) => handleEdit(index, value)}
              isEditing={!!editing[`mobile-true-expense-${index}`]}
              onToggleEdit={() => toggleEdit(`mobile-true-expense-${index}`)}
              onBlur={() => handleBlur(`mobile-true-expense-${index}`)}
            />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
