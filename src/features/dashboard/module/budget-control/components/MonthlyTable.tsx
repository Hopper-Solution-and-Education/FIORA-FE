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

interface MonthlyTableProps {
  data: Pick<BudgetData, 'editableValues' | 'plannedIncome' | 'trueExpense' | 'trueIncome'>;
  actions: Pick<BudgetActions, 'handleEdit' | 'toggleEdit' | 'handleBlur'>;
  editing: { [key: string]: boolean };
  monthlyAmount: number;
  monthlyIncome: number;
}

export function MonthlyTable({
  data,
  actions,
  editing,
  monthlyAmount,
  monthlyIncome,
}: MonthlyTableProps) {
  const { editableValues, plannedIncome, trueExpense, trueIncome } = data;
  const { handleEdit, toggleEdit, handleBlur } = actions;

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableCell>Months</TableCell>
          {MONTHS.map((month, index) => (
            <TableHead key={index} className="text-center">
              {month}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* KH Chi (Planned Expense) */}
        <TableRow>
          <TableCell>KH Chi</TableCell>
          {MONTHS.map((month, index) => (
            <EditableCell
              key={`expense-${month}`}
              value={editableValues[month] ?? monthlyAmount}
              onEdit={(value) => handleEdit(month, value)}
              isEditing={!!editing[`expense-${month}`]}
              onToggleEdit={() => toggleEdit(`expense-${month}`)}
              onBlur={() => handleBlur(`expense-${month}`)}
            />
          ))}
        </TableRow>

        {/* Thực chi (Actual Expense) */}
        <TableRow>
          <TableCell>Thực chi</TableCell>
          {trueExpense.map((value, index) => (
            <EditableCell
              key={`true-expense-${index}`}
              value={value}
              onEdit={(value) => handleEdit(index, value)}
              isEditing={!!editing[`true-expense-${index}`]}
              onToggleEdit={() => toggleEdit(`true-expense-${index}`)}
              onBlur={() => handleBlur(`true-expense-${index}`)}
            />
          ))}
        </TableRow>

        {/* KH Thu (Planned Income) */}
        <TableRow>
          <TableCell>KH Thu</TableCell>
          {MONTHS.map((month, index) => (
            <EditableCell
              key={`income-${month}`}
              value={plannedIncome[month] ?? monthlyIncome}
              onEdit={(value) => handleEdit(month, value, 'income')}
              isEditing={!!editing[`income-${month}`]}
              onToggleEdit={() => toggleEdit(`income-${month}`)}
              onBlur={() => handleBlur(`income-${month}`)}
            />
          ))}
        </TableRow>

        {/* Thực Thu (Actual Income) */}
        <TableRow>
          <TableCell>Thực Thu</TableCell>
          {trueIncome.map((value, index) => (
            <EditableCell
              key={`true-income-${index}`}
              value={value}
              onEdit={(value) => handleEdit(index, value, 'income')}
              isEditing={!!editing[`true-income-${index}`]}
              onToggleEdit={() => toggleEdit(`true-income-${index}`)}
              onBlur={() => handleBlur(`true-income-${index}`)}
            />
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
