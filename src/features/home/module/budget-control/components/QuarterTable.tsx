'use client';

import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/store';
import { handleBlur, handleEdit, toggleEdit } from '../slices/budgetSlice';
import { EditableCell } from './EditableCell';

export function QuarterTable() {
  const dispatch = useAppDispatch();
  const { editableValues, editing, totalExpense } = useAppSelector((state) => state.budget);

  const quarterlyExpense = totalExpense / 4;

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center font-bold">Q1</TableHead>
          <TableHead className="text-center font-bold">Q2</TableHead>
          <TableHead className="text-center font-bold">Q3</TableHead>
          <TableHead className="text-center font-bold">Q4</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <EditableCell
            value={editableValues['Q1'] ?? quarterlyExpense}
            onEdit={(value) => dispatch(handleEdit({ key: 'Q1', value, type: 'expense' }))}
            isEditing={!!editing['Q1']}
            onToggleEdit={() => dispatch(toggleEdit('Q1'))}
            onBlur={() => dispatch(handleBlur('Q1'))}
          />
          <EditableCell
            value={editableValues['Q2'] ?? quarterlyExpense}
            onEdit={(value) => dispatch(handleEdit({ key: 'Q2', value, type: 'expense' }))}
            isEditing={!!editing['Q2']}
            onToggleEdit={() => dispatch(toggleEdit('Q2'))}
            onBlur={() => dispatch(handleBlur('Q2'))}
          />
          <EditableCell
            value={editableValues['Q3'] ?? quarterlyExpense}
            onEdit={(value) => dispatch(handleEdit({ key: 'Q3', value, type: 'expense' }))}
            isEditing={!!editing['Q3']}
            onToggleEdit={() => dispatch(toggleEdit('Q3'))}
            onBlur={() => dispatch(handleBlur('Q3'))}
          />
          <EditableCell
            value={editableValues['Q4'] ?? quarterlyExpense}
            onEdit={(value) => dispatch(handleEdit({ key: 'Q4', value, type: 'expense' }))}
            isEditing={!!editing['Q4']}
            onToggleEdit={() => dispatch(toggleEdit('Q4'))}
            onBlur={() => dispatch(handleBlur('Q4'))}
          />
        </TableRow>
      </TableBody>
    </Table>
  );
}
