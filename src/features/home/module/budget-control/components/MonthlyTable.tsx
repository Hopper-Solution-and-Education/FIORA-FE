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

interface MonthlyTableProps {
  data: Pick<BudgetData, 'editableValues' | 'plannedIncome' | 'trueExpense' | 'trueIncome'>;
  editing: { [key: string]: boolean };
  monthlyAmount: number;
  monthlyIncome: number;
}

export function MonthlyTable({ data, editing, monthlyAmount, monthlyIncome }: MonthlyTableProps) {
  const { editableValues, plannedIncome, trueExpense, trueIncome } = data;
  const dispatch = useAppDispatch();

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableCell></TableCell>
          {MONTHS.map((month, index) => (
            <TableHead key={index} className="text-center font-bold">
              {month}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* KH Chi (Planned Expense) */}
        <TableRow>
          <TableCell className="font-bold">KH Chi</TableCell>
          {MONTHS.map((month) => (
            <EditableCell
              key={`expense-${month}`}
              value={editableValues[month] ?? monthlyAmount}
              onEdit={(value) => dispatch(handleEdit({ key: month, value, type: 'expense' }))}
              isEditing={!!editing[`expense-${month}`]}
              onToggleEdit={() => dispatch(toggleEdit(`expense-${month}`))}
              onBlur={() => dispatch(handleBlur(`expense-${month}`))}
            />
          ))}
        </TableRow>

        {/* Thực chi (Actual Expense) */}
        <TableRow>
          <TableCell className="font-bold">Thực chi</TableCell>
          {trueExpense.map((value, index) => (
            <EditableCell
              key={`true-expense-${index}`}
              value={value}
              onEdit={(value) => dispatch(handleEdit({ key: index, value, type: 'expense' }))}
              isEditing={!!editing[`true-expense-${index}`]}
              onToggleEdit={() => dispatch(toggleEdit(`true-expense-${index}`))}
              onBlur={() => dispatch(handleBlur(`true-expense-${index}`))}
            />
          ))}
        </TableRow>

        {/* KH Thu (Planned Income) */}
        <TableRow>
          <TableCell className="font-bold">KH Thu</TableCell>
          {MONTHS.map((month) => (
            <EditableCell
              key={`income-${month}`}
              value={plannedIncome[month] ?? monthlyIncome}
              onEdit={(value) => dispatch(handleEdit({ key: month, value, type: 'income' }))}
              isEditing={!!editing[`income-${month}`]}
              onToggleEdit={() => dispatch(toggleEdit(`income-${month}`))}
              onBlur={() => dispatch(handleBlur(`income-${month}`))}
            />
          ))}
        </TableRow>

        {/* Thực Thu (Actual Income) */}
        <TableRow>
          <TableCell className="font-bold">Thực Thu</TableCell>
          {trueIncome.map((value, index) => (
            <EditableCell
              key={`true-income-${index}`}
              value={value}
              onEdit={(value) => dispatch(handleEdit({ key: index, value, type: 'income' }))}
              isEditing={!!editing[`true-income-${index}`]}
              onToggleEdit={() => dispatch(toggleEdit(`true-income-${index}`))}
              onBlur={() => dispatch(handleBlur(`true-income-${index}`))}
            />
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
