// pages/index.tsx
import { CustomTable } from '@/components/common/tables/report-table-v2';
import {
  DataSourceProps,
  ColumnProps,
  PAGINATION_POSITION,
} from '@/components/common/tables/report-table-v2/types';
import { Icons } from '@/components/Icon';
import React from 'react';

const columns: ColumnProps[] = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
  },
  { title: 'JAN', dataIndex: 'jan', key: 'jan', align: 'center' },
  { title: 'FEB', dataIndex: 'feb', key: 'feb', align: 'center' },
  { title: 'MAR', dataIndex: 'mar', key: 'mar', align: 'center' },
  { title: 'Q1', dataIndex: 'q1', key: 'q1', align: 'center' },
  { title: 'APR', dataIndex: 'apr', key: 'apr', align: 'center' },
  { title: 'MAY', dataIndex: 'may', key: 'may', align: 'center' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: () => (
      <div className="grid grid-flow-col">
        <span className="text-red-500 cursor-pointer hover:text-red-700">
          <Icons.close size={15} />
        </span>
        <span className="text-green-500 cursor-pointer hover:text-green-700">
          <Icons.check size={15} />
        </span>
      </div>
    ),
  },
];

const dataSource: DataSourceProps[] = [
  {
    category: 'Total Top Down',
    jan: '10M €',
    feb: '10M €',
    mar: '10M €',
    q1: '30M €',
    apr: '10M €',
    may: '10M €',
    status: 'valid',
  },
  {
    category: 'Food & Drink - Bottom-up Plan',
    jan: '4M €',
    feb: '4M €',
    mar: '4M €',
    q1: '12M €',
    apr: '4M €',
    may: '4M €',
    status: 'valid',
  },
  {
    category: 'Food & Drink - Actual sum-up',
    jan: '3.4M €',
    feb: '3.5M €',
    mar: '4M €',
    q1: '10.6M €',
    apr: '3.1M €',
    may: '3.5M €',
    status: 'invalid',
  },
];

const FinancialTable: React.FC = () => {
  return (
    <div className="p-4">
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        bordered
        scroll={{ x: 1200 }}
        size="middle"
        rowHover
        pagination={{ position: PAGINATION_POSITION.BOTTOM_RIGHT, pageSize: 10 }}
        onRowClick={(row) => console.log('Row clicked:', row)}
      />
    </div>
  );
};

export default FinancialTable;
