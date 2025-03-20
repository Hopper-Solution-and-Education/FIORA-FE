'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppDispatch } from '@/store';
import { handleBlur, handleEdit, toggleEdit } from '../slices/budgetSlice';
import { BudgetData } from '../types/budget';
import { EditableCell } from './EditableCell';

interface YearlyTableProps {
  data: Pick<BudgetData, 'editableValues'>;
  editing: { [key: string]: boolean };
  halfYearlyAmount: number;
}

export function YearlyTable({ data, editing, halfYearlyAmount }: YearlyTableProps) {
  const { editableValues } = data;
  const dispatch = useAppDispatch();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-bold">First Half Year (FHY)</TableHead>
          <TableHead className="text-center font-bold">Second Half Year (SHY)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <EditableCell
            value={editableValues['yearly'] ?? halfYearlyAmount}
            onEdit={(value) => dispatch(handleEdit({ key: 'yearly', value, type: 'expense' }))}
            isEditing={!!editing['yearly']}
            onToggleEdit={() => dispatch(toggleEdit('yearly'))}
            onBlur={() => dispatch(handleBlur('yearly'))}
          />
          <EditableCell
            value={editableValues['halfYearly'] ?? halfYearlyAmount}
            onEdit={(value) => dispatch(handleEdit({ key: 'halfYearly', value, type: 'expense' }))}
            isEditing={!!editing['halfYearly']}
            onToggleEdit={() => dispatch(toggleEdit('halfYearly'))}
            onBlur={() => dispatch(handleBlur('halfYearly'))}
          />
        </TableRow>
      </TableBody>
    </Table>
  );
}
