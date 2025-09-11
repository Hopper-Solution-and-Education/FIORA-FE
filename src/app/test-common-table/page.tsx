'use client';

import { CommonTable } from '@/components/common/organisms';
import {
  ColumnConfigMap,
  CommonTableColumn,
} from '@/components/common/organisms/CommonTable/types';
import { useCallback, useMemo, useState } from 'react';

type DemoRow = {
  id: string;
  name: string;
  amount: number;
  status: 'Active' | 'Inactive';
};

const initialData: DemoRow[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `ROW-${i + 1}`,
  name: `Item ${i + 1}`,
  amount: Math.round(Math.random() * 10000) / 100,
  status: i % 2 === 0 ? 'Active' : 'Inactive',
}));

export default function Page() {
  const [rows, setRows] = useState<DemoRow[]>(initialData);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns: CommonTableColumn<DemoRow>[] = useMemo(
    () => [
      { key: 'id', title: 'ID', align: 'left', width: 160 },
      { key: 'name', title: 'Name', align: 'left', render: (r) => <b>{r.name}</b> },
      {
        key: 'amount',
        title: 'Amount',
        align: 'right',
        className: 'text-primary',
        render: (r) => <span>{r.amount.toLocaleString('en-US')}</span>,
      },
      {
        key: 'status',
        title: 'Status',
        align: 'center',
        render: (r) => (
          <span className={r.status === 'Active' ? 'text-emerald-600' : 'text-muted-foreground'}>
            {r.status}
          </span>
        ),
      },
    ],
    [],
  );

  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(() => ({
    id: { isVisible: true, index: 0, align: 'left' },
    name: { isVisible: true, index: 1, align: 'left' },
    amount: { isVisible: true, index: 2, align: 'right' },
    status: { isVisible: true, index: 3, align: 'center' },
  }));

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const current = rows.length;

      const more: DemoRow[] = Array.from({ length: 10 }).map((_, i) => ({
        id: `ROW-${current + i + 1}`,
        name: `Item ${current + i + 1}`,
        amount: Math.round(Math.random() * 10000) / 100,
        status: (current + i) % 2 === 0 ? 'Active' : 'Inactive',
      }));

      const newRows = [...rows, ...more];
      setRows(newRows);

      if (newRows.length >= 60) setHasMore(false);
      setIsLoadingMore(false);
    }, 600);
  }, [isLoadingMore, rows]);

  return (
    <section className="container mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">CommonTable Demo</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2 py-1 text-sm border rounded"
            onClick={() => setLoading((v) => !v)}
          >
            Toggle Loading
          </button>
        </div>
      </div>

      <CommonTable<DemoRow>
        data={rows}
        columns={columns}
        columnConfig={columnConfig}
        onColumnConfigChange={setColumnConfig}
        storageKey="test-common-table:demo"
        loading={loading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        rightHeaderNode={<div className="text-sm text-muted-foreground">Right header</div>}
        leftHeaderNode={<div className="text-sm text-muted-foreground">Left header</div>}
      />
    </section>
  );
}
