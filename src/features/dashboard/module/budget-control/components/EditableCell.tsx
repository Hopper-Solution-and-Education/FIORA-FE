'use client';

import { Input } from '@/components/ui/input';
import { TableCell } from '@/components/ui/table';
import { EditableCellProps } from '../types/budget';

export function EditableCell({
  value,
  onEdit,
  isEditing,
  onToggleEdit,
  onBlur,
  className = 'text-center',
}: EditableCellProps) {
  return (
    <TableCell className={className} onClick={onToggleEdit}>
      {isEditing ? (
        <Input
          type="number"
          value={value}
          onChange={(e) => onEdit(e.target.value)}
          onBlur={onBlur}
          className="text-center"
          autoFocus
        />
      ) : (
        <span className="cursor-pointer hover:bg-gray-100 p-2 rounded block w-full text-center">
          {value.toLocaleString()}
        </span>
      )}
    </TableCell>
  );
}
