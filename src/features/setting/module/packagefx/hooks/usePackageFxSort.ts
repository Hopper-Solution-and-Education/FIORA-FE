import { useState } from 'react';

export function usePackageFxSort(
  initialField = 'createdAt',
  initialOrder: 'asc' | 'desc' = 'desc',
) {
  const [sortField, setSortField] = useState(initialField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialOrder);

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  return { sortField, sortOrder, handleSort };
}
