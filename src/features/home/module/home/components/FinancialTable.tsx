import { CustomTable } from '@/components/common/tables/report-table-v2';
import {
  ColumnProps,
  DataSourceProps,
  PAGINATION_POSITION,
} from '@/components/common/tables/report-table-v2/types';
import { Icons } from '@/components/Icon';
import { CURRENCY } from '@/shared/constants';
import { cn, formatCurrency } from '@/shared/utils';
import React from 'react';
import CategorySelect from '../../category/components/CategorySelect';
import { useAppSelector } from '@/store';

const columns: ColumnProps[] = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    align: 'left',
    width: 200,
    fixed: 'left',
    render: (text: string) => (
      <div className="flex items-center gap-2">
        <span className={cn('inline-flex items-center font-medium text-gray-800')}>{text}</span>
      </div>
    ),
  },
  {
    title: 'JAN',
    dataIndex: 'jan',
    key: 'jan',
    align: 'center',
    width: 80,
    headerAlign: 'center',
  },
  {
    title: 'FEB',
    dataIndex: 'feb',
    key: 'feb',
    align: 'center',
    width: 80,
    headerAlign: 'center',
  },
  { title: 'MAR', dataIndex: 'mar', key: 'mar', align: 'center', width: 80, headerAlign: 'center' },
  {
    title: 'Q1',
    dataIndex: 'q1',
    key: 'q1',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  { title: 'APR', dataIndex: 'apr', key: 'apr', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'MAY', dataIndex: 'may', key: 'may', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'JUN', dataIndex: 'jun', key: 'jun', align: 'center', width: 80, headerAlign: 'center' },
  {
    title: 'Q2',
    dataIndex: 'q2',
    key: 'q2',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  {
    title: 'H1',
    dataIndex: 'h1',
    key: 'h1',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  { title: 'JUL', dataIndex: 'jul', key: 'jul', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'AUG', dataIndex: 'aug', key: 'aug', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'SEP', dataIndex: 'sep', key: 'sep', align: 'center', width: 80, headerAlign: 'center' },
  {
    title: 'Q3',
    dataIndex: 'q3',
    key: 'q3',
    align: 'center',
    width: 80,
    headerAlign: 'center',
  },
  { title: 'OCT', dataIndex: 'oct', key: 'oct', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'NOV', dataIndex: 'nov', key: 'nov', align: 'center', width: 80, headerAlign: 'center' },
  { title: 'DEC', dataIndex: 'dec', key: 'dec', align: 'center', width: 80, headerAlign: 'center' },
  {
    title: 'Q4',
    dataIndex: 'q4',
    key: 'q4',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  {
    title: 'H2',
    dataIndex: 'h2',
    key: 'h2',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  {
    title: 'Full Year',
    dataIndex: 'fullYear',
    key: 'fullYear',
    align: 'center',
    width: 80,
    headerAlign: 'center',
    render: (text: string) => (
      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded">
        {text}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    fixed: 'right',
    render: () => (
      <div className="grid grid-flow-col place-items-center gap-2">
        <span className="text-red-500 cursor-pointer hover:text-red-700" title="Invalid">
          <Icons.close size={15} />
        </span>
        <span className="text-green-500 cursor-pointer hover:text-green-700" title="Valid">
          <Icons.check size={15} />
        </span>
      </div>
    ),
  },
];

const FinancialTable: React.FC = () => {
  const { categories } = useAppSelector((state) => state.category);

  const dataSource: DataSourceProps[] = [
    {
      category: 'Total Top Down',
      jan: formatCurrency(10000000, CURRENCY.VND),
      feb: formatCurrency(10000000, CURRENCY.VND),
      mar: formatCurrency(10000000, CURRENCY.VND),
      q1: formatCurrency(30000000, CURRENCY.VND),
      apr: formatCurrency(10000000, CURRENCY.VND),
      may: formatCurrency(10000000, CURRENCY.VND),
      jun: formatCurrency(10000000, CURRENCY.VND),
      q2: formatCurrency(30000000, CURRENCY.VND),
      h1: formatCurrency(60000000, CURRENCY.VND),
      jul: formatCurrency(10000000, CURRENCY.VND),
      aug: formatCurrency(10000000, CURRENCY.VND),
      sep: formatCurrency(10000000, CURRENCY.VND),
      q3: formatCurrency(30000000, CURRENCY.VND),
      oct: formatCurrency(10000000, CURRENCY.VND),
      nov: formatCurrency(10000000, CURRENCY.VND),
      dec: formatCurrency(10000000, CURRENCY.VND),
      q4: formatCurrency(30000000, CURRENCY.VND),
      h2: formatCurrency(60000000, CURRENCY.VND),
      fullYear: formatCurrency(120000000, CURRENCY.VND),
      status: null,
    },
    {
      category: 'Total Bottom Up',
      jan: formatCurrency(6000000, CURRENCY.VND),
      feb: formatCurrency(6000000, CURRENCY.VND),
      mar: formatCurrency(6000000, CURRENCY.VND),
      q1: formatCurrency(18000000, CURRENCY.VND),
      apr: formatCurrency(6000000, CURRENCY.VND),
      may: formatCurrency(6000000, CURRENCY.VND),
      jun: formatCurrency(6000000, CURRENCY.VND),
      q2: formatCurrency(18000000, CURRENCY.VND),
      h1: formatCurrency(36000000, CURRENCY.VND),
      jul: formatCurrency(6000000, CURRENCY.VND),
      aug: formatCurrency(6000000, CURRENCY.VND),
      sep: formatCurrency(6000000, CURRENCY.VND),
      q3: formatCurrency(18000000, CURRENCY.VND),
      oct: formatCurrency(6000000, CURRENCY.VND),
      nov: formatCurrency(6000000, CURRENCY.VND),
      dec: formatCurrency(6000000, CURRENCY.VND),
      q4: formatCurrency(18000000, CURRENCY.VND),
      h2: formatCurrency(36000000, CURRENCY.VND),
      fullYear: formatCurrency(72000000, CURRENCY.VND),
      status: null,
    },
    {
      category: 'Total Actual Sum Up',
      jan: formatCurrency(5100000, CURRENCY.VND),
      feb: formatCurrency(5000000, CURRENCY.VND),
      mar: formatCurrency(5800000, CURRENCY.VND),
      q1: formatCurrency(15900000, CURRENCY.VND),
      apr: formatCurrency(5100000, CURRENCY.VND),
      may: formatCurrency(5000000, CURRENCY.VND),
      jun: formatCurrency(5800000, CURRENCY.VND),
      q2: formatCurrency(15900000, CURRENCY.VND),
      h1: formatCurrency(31800000, CURRENCY.VND),
      jul: formatCurrency(5100000, CURRENCY.VND),
      aug: formatCurrency(5000000, CURRENCY.VND),
      sep: formatCurrency(5800000, CURRENCY.VND),
      q3: formatCurrency(15900000, CURRENCY.VND),
      oct: formatCurrency(5100000, CURRENCY.VND),
      nov: formatCurrency(5000000, CURRENCY.VND),
      dec: formatCurrency(5800000, CURRENCY.VND),
      q4: formatCurrency(15900000, CURRENCY.VND),
      h2: formatCurrency(31800000, CURRENCY.VND),
      fullYear: formatCurrency(63600000, CURRENCY.VND),
      status: null,
    },
    {
      category: <CategorySelect name="category" categories={categories.data || []} />,
      jan: formatCurrency(5100000, CURRENCY.VND),
      feb: formatCurrency(5000000, CURRENCY.VND),
      mar: formatCurrency(5800000, CURRENCY.VND),
      q1: formatCurrency(15900000, CURRENCY.VND),
      apr: formatCurrency(5100000, CURRENCY.VND),
      may: formatCurrency(5000000, CURRENCY.VND),
      jun: formatCurrency(5800000, CURRENCY.VND),
      q2: formatCurrency(15900000, CURRENCY.VND),
      h1: formatCurrency(31800000, CURRENCY.VND),
      jul: formatCurrency(5100000, CURRENCY.VND),
      aug: formatCurrency(5000000, CURRENCY.VND),
      sep: formatCurrency(5800000, CURRENCY.VND),
      q3: formatCurrency(15900000, CURRENCY.VND),
      oct: formatCurrency(5100000, CURRENCY.VND),
      nov: formatCurrency(5000000, CURRENCY.VND),
      dec: formatCurrency(5800000, CURRENCY.VND),
      q4: formatCurrency(15900000, CURRENCY.VND),
      h2: formatCurrency(31800000, CURRENCY.VND),
      fullYear: formatCurrency(63600000, CURRENCY.VND),
      status: null,
    },
  ];
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
