import { CustomTable } from '@/components/common/tables/custom-table';
import {
  ColumnProps,
  DataSourceProps,
  PAGINATION_POSITION,
} from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
import { CURRENCY } from '@/shared/constants';
import { InputCurrency } from '@/components/common/forms';
import { fetchCategories } from '@/features/home/module/category/slices/actions';
import { cn, formatCurrency } from '@/shared/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import React, { useEffect } from 'react';
import CategorySelect from '../../category/components/CategorySelect';

const columns: ColumnProps[] = [
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    align: 'left',
    width: 200,
    fixed: 'left',
    render: (text: string, record: DataSourceProps) => {
      const paddingClassName = record.isChild ? 'pl-4' : '';
      const textClassName = record.isChild
        ? 'text-gray-600 dark:text-gray-200'
        : 'text-gray-800 dark:text-gray-400';
      return (
        <span
          className={cn(
            'inline-flex items-center font-medium w-full',
            paddingClassName,
            textClassName,
          )}
        >
          {text}
        </span>
      );
    },
    onCell: (record: DataSourceProps) => ({
      rowSpan: record.onCell?.().rowSpan || 1,
    }),
  },
  {
    title: 'JAN',
    dataIndex: 'jan',
    key: 'jan',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'FEB',
    dataIndex: 'feb',
    key: 'feb',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'MAR',
    dataIndex: 'mar',
    key: 'mar',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'Q1',
    dataIndex: 'q1',
    key: 'q1',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Dark mode background and text
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'APR',
    dataIndex: 'apr',
    key: 'apr',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'MAY',
    dataIndex: 'may',
    key: 'may',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'JUN',
    dataIndex: 'jun',
    key: 'jun',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'Q2',
    dataIndex: 'q2',
    key: 'q2',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Dark mode background and text
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'H1',
    dataIndex: 'h1',
    key: 'h1',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Dark mode background and text
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'JUL',
    dataIndex: 'jul',
    key: 'jul',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'AUG',
    dataIndex: 'aug',
    key: 'aug',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'SEP',
    dataIndex: 'sep',
    key: 'sep',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'Q3',
    dataIndex: 'q3',
    key: 'q3',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'OCT',
    dataIndex: 'oct',
    key: 'oct',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'NOV',
    dataIndex: 'nov',
    key: 'nov',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'DEC',
    dataIndex: 'dec',
    key: 'dec',
    align: 'center',
    width: 120,
    headerAlign: 'center',
  },
  {
    title: 'Q4',
    dataIndex: 'q4',
    key: 'q4',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Dark mode background and text
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'H2',
    dataIndex: 'h2',
    key: 'h2',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', // Dark mode background and text
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'Full Year',
    dataIndex: 'fullYear',
    key: 'fullYear',
    align: 'center',
    width: 120,
    headerAlign: 'center',
    render: (text: string, record: DataSourceProps) => {
      if (!text || record.isParent) return null;
      return (
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 rounded',
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          )}
        >
          {text}
        </span>
      );
    },
  },
  {
    title: 'ACTION',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    fixed: 'right',
    render: (record: ColumnProps) => {
      if (!record) return null;
      return (
        <div className="grid grid-flow-col place-items-center gap-2">
          <span
            className={cn(
              'cursor-pointer',
              'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600',
            )}
            title="Invalid"
          >
            <Icons.close size={15} />
          </span>
          <span
            className={cn(
              'cursor-pointer',
              'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600',
            )}
            title="Valid"
          >
            <Icons.check size={15} />
          </span>
        </div>
      );
    },
  },
];

const FinancialTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const dataSource: DataSourceProps[] = [
    {
      category: 'Total Top Down',
      jan: (
        <InputCurrency name="jan" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      feb: (
        <InputCurrency name="feb" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      mar: (
        <InputCurrency name="mar" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      q1: formatCurrency(30000000, CURRENCY.VND),
      apr: (
        <InputCurrency name="apr" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      may: (
        <InputCurrency name="may" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      jun: (
        <InputCurrency name="jun" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      q2: formatCurrency(30000000, CURRENCY.VND),
      h1: formatCurrency(60000000, CURRENCY.VND),
      jul: (
        <InputCurrency name="jul" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      aug: (
        <InputCurrency name="aug" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      sep: (
        <InputCurrency name="sep" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      q3: formatCurrency(30000000, CURRENCY.VND),
      oct: (
        <InputCurrency name="oct" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      nov: (
        <InputCurrency name="nov" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      dec: (
        <InputCurrency name="dec" value={10000000} currency={CURRENCY.VND} classContainer={'m-0'} />
      ),
      q4: formatCurrency(30000000, CURRENCY.VND),
      h2: formatCurrency(60000000, CURRENCY.VND),
      fullYear: formatCurrency(120000000, CURRENCY.VND),
      action: true,
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
    },
    {
      category: 'Total Actual Sum Up',
      jan: formatCurrency(10000000, CURRENCY.VND),
      feb: formatCurrency(10000000, CURRENCY.VND),
      mar: formatCurrency(10000000, CURRENCY.VND),
      q1: formatCurrency(30000000, CURRENCY.VND),
      apr: formatCurrency(10000000, CURRENCY.VND),
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
      category: (
        <CategorySelect
          className="w-full h-full m-0"
          name="category"
          value="cb959a60-dbba-43f7-823f-a091b98b7dd8"
          categories={categories.data || []}
          side="right"
        />
      ),
      isParent: true,
      children: [
        {
          category: 'Bottom Up',
          jan: (
            <InputCurrency
              name="jan"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          feb: (
            <InputCurrency
              name="feb"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          mar: (
            <InputCurrency
              name="mar"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q1: (
            <InputCurrency
              name="q1"
              value={12000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          apr: (
            <InputCurrency
              name="apr"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          may: (
            <InputCurrency
              name="may"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jun: (
            <InputCurrency
              name="jun"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q2: (
            <InputCurrency
              name="q2"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h1: (
            <InputCurrency
              name="h1"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jul: (
            <InputCurrency
              name="jul"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          aug: (
            <InputCurrency
              name="aug"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          sep: (
            <InputCurrency
              name="sep"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q3: (
            <InputCurrency
              name="q3"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          oct: (
            <InputCurrency
              name="oct"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          nov: (
            <InputCurrency
              name="nov"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          dec: (
            <InputCurrency
              name="dec"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q4: (
            <InputCurrency
              name="q4"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h2: (
            <InputCurrency
              name="h2"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          fullYear: (
            <InputCurrency
              name="fullYear"
              value={63600000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          action: true,
          isChild: true,
        },
        {
          category: 'Actual sum-up',
          jan: (
            <InputCurrency
              name="jan"
              value={3100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          feb: (
            <InputCurrency
              name="feb"
              value={3500000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          mar: (
            <InputCurrency
              name="mar"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q1: (
            <InputCurrency
              name="q1"
              value={10600000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          apr: (
            <InputCurrency
              name="apr"
              value={3100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          may: (
            <InputCurrency
              name="may"
              value={3500000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jun: (
            <InputCurrency
              name="jun"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q2: (
            <InputCurrency
              name="q2"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h1: (
            <InputCurrency
              name="h1"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jul: (
            <InputCurrency
              name="jul"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          aug: (
            <InputCurrency
              name="aug"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          sep: (
            <InputCurrency
              name="sep"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q3: (
            <InputCurrency
              name="q3"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          oct: (
            <InputCurrency
              name="oct"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          nov: (
            <InputCurrency
              name="nov"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          dec: (
            <InputCurrency
              name="dec"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q4: (
            <InputCurrency
              name="q4"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h2: (
            <InputCurrency
              name="h2"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          fullYear: (
            <InputCurrency
              name="fullYear"
              value={63600000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          action: true,
          isChild: true,
        },
      ],
    },
    {
      category: (
        <CategorySelect
          className="w-full h-full m-0"
          name="category"
          value="164b30cd-09f5-4e93-a824-00134c1f4b06"
          categories={categories.data || []}
          side="right"
        />
      ),
      isParent: true,
      children: [
        {
          category: 'Bottom-up Plan',
          jan: (
            <InputCurrency
              name="jan"
              value={2000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          feb: (
            <InputCurrency
              name="feb"
              value={2000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          mar: (
            <InputCurrency
              name="mar"
              value={2000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q1: (
            <InputCurrency
              name="q1"
              value={6000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          apr: (
            <InputCurrency
              name="apr"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          may: (
            <InputCurrency
              name="may"
              value={4000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jun: (
            <InputCurrency
              name="jun"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q2: (
            <InputCurrency
              name="q2"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h1: (
            <InputCurrency
              name="h1"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jul: (
            <InputCurrency
              name="jul"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          aug: (
            <InputCurrency
              name="aug"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          sep: (
            <InputCurrency
              name="sep"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q3: (
            <InputCurrency
              name="q3"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          oct: (
            <InputCurrency
              name="oct"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          nov: (
            <InputCurrency
              name="nov"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          dec: (
            <InputCurrency
              name="dec"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q4: (
            <InputCurrency
              name="q4"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h2: (
            <InputCurrency
              name="h2"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          fullYear: (
            <InputCurrency
              name="fullYear"
              value={63600000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          action: true,
          isChild: true,
        },
        {
          category: 'Actual sum-up',
          jan: (
            <InputCurrency
              name="jan"
              value={2000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          feb: (
            <InputCurrency
              name="feb"
              value={1500000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          mar: (
            <InputCurrency
              name="mar"
              value={1800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q1: (
            <InputCurrency
              name="q1"
              value={5300000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          apr: (
            <InputCurrency
              name="apr"
              value={2000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          may: (
            <InputCurrency
              name="may"
              value={1500000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jun: (
            <InputCurrency
              name="jun"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q2: (
            <InputCurrency
              name="q2"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h1: (
            <InputCurrency
              name="h1"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          jul: (
            <InputCurrency
              name="jul"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          aug: (
            <InputCurrency
              name="aug"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          sep: (
            <InputCurrency
              name="sep"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q3: (
            <InputCurrency
              name="q3"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          oct: (
            <InputCurrency
              name="oct"
              value={5100000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          nov: (
            <InputCurrency
              name="nov"
              value={5000000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          dec: (
            <InputCurrency
              name="dec"
              value={5800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          q4: (
            <InputCurrency
              name="q4"
              value={15900000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          h2: (
            <InputCurrency
              name="h2"
              value={31800000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          fullYear: (
            <InputCurrency
              name="fullYear"
              value={63600000}
              currency={CURRENCY.VND}
              classContainer={'m-0'}
            />
          ),
          action: true,
          isChild: true,
        },
      ],
    },
    {
      category: (
        <div className={cn('w-full h-full flex items-center gap-2', 'bg-white dark:bg-gray-800')}>
          <CategorySelect
            className="w-full h-full m-0"
            name="category"
            categories={categories.data || []}
            side="right"
          />
        </div>
      ),
      isParent: true,
      action: true,
    },
  ];

  return (
    <div className={cn('p-4')}>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        bordered
        layoutBorder
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
