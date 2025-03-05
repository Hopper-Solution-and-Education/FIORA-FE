'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BudgetActions, BudgetData } from '../types/budget';
import { EditableCell } from './EditableCell';

interface YearlyTableProps {
  data: Pick<BudgetData, 'editableValues' | 'totalExpense'>;
  actions: Pick<BudgetActions, 'handleEdit' | 'toggleEdit' | 'handleBlur'>;
  editing: { [key: string]: boolean };
  halfYearlyAmount: number;
}

export function YearlyTable({ data, actions, editing, halfYearlyAmount }: YearlyTableProps) {
  const { editableValues, totalExpense } = data;
  const { handleEdit, toggleEdit, handleBlur } = actions;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Full Year</TableHead>
          <TableHead className="text-center">Half Year</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <EditableCell
            value={editableValues['yearly'] ?? totalExpense}
            onEdit={(value) => handleEdit('yearly', value)}
            isEditing={!!editing['yearly']}
            onToggleEdit={() => toggleEdit('yearly')}
            onBlur={() => handleBlur('yearly')}
          />
          <EditableCell
            value={editableValues['halfYearly'] ?? halfYearlyAmount}
            onEdit={(value) => handleEdit('halfYearly', value)}
            isEditing={!!editing['halfYearly']}
            onToggleEdit={() => toggleEdit('halfYearly')}
            onBlur={() => handleBlur('halfYearly')}
          />
        </TableRow>
      </TableBody>
    </Table>
  );
}
