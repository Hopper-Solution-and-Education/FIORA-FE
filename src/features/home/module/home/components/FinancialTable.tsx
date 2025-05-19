'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { ReportTable } from '@/components/common/tables/report-table';

export default function FinancialTable() {
  const [year, setYear] = useState('2025');
  const [period, setPeriod] = useState('Full Year');
  const [tab, setTab] = useState('Expense');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'Food & Drink': true,
    Transport: true,
  });

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Financial data
  const financialData = [
    {
      key: 'total-top-down',
      category: 'Total Top Down',
      jan: '10M',
      feb: '10M',
      mar: '10M',
      q1: '30M',
      apr: '10M',
      may: '10M',
      type: 'summary',
    },
    {
      key: 'total-bottom-up',
      category: 'Total Bottom Up',
      jan: '6M',
      feb: '6M',
      mar: '6M',
      q1: '18M',
      apr: '6M',
      may: '6M',
      type: 'summary',
    },
    {
      key: 'total-actual-sum-up',
      category: 'Total Actual Sum Up',
      jan: '10M',
      feb: '10M',
      mar: '10M',
      q1: '30M',
      apr: '10M',
      may: '10M',
      type: 'summary',
    },
    {
      key: 'food-drink',
      category: 'Food & Drink',
      jan: '',
      feb: '',
      mar: '',
      q1: '',
      apr: '',
      may: '',
      type: 'category',
      hasChildren: true,
      isExpanded: expandedCategories['Food & Drink'],
      status: 'warning', // For check/x marks
    },
    {
      key: 'food-drink-plan',
      parentCategory: 'Food & Drink',
      subCategory: 'Bottom-up Plan',
      jan: '4M',
      feb: '4M',
      mar: '4M',
      q1: '12M',
      apr: '4M',
      may: '4M',
      type: 'subcategory',
      isHidden: !expandedCategories['Food & Drink'],
    },
    {
      key: 'food-drink-actual',
      parentCategory: 'Food & Drink',
      subCategory: 'Actual sum-up',
      jan: '3.1M',
      feb: '3.5M',
      mar: '4M',
      q1: '10.6M',
      apr: '3.1M',
      may: '3.5M',
      type: 'subcategory',
      isHidden: !expandedCategories['Food & Drink'],
      valueColor: 'text-red-500',
    },
    {
      key: 'transport',
      category: 'Transport',
      jan: '',
      feb: '',
      mar: '',
      q1: '',
      apr: '',
      may: '',
      type: 'category',
      hasChildren: true,
      isExpanded: expandedCategories['Transport'],
      status: 'warning', // For check/x marks
    },
    {
      key: 'transport-plan',
      parentCategory: 'Transport',
      subCategory: 'Bottom-up Plan',
      jan: '2M',
      feb: '2M',
      mar: '2M',
      q1: '6M',
      apr: '4M',
      may: '4M',
      type: 'subcategory',
      isHidden: !expandedCategories['Transport'],
    },
    {
      key: 'transport-actual',
      parentCategory: 'Transport',
      subCategory: 'Actual sum-up',
      jan: '2M',
      feb: '1.5M',
      mar: '1.8M',
      q1: '5.3M',
      apr: '2M',
      may: '1.5M',
      type: 'subcategory',
      isHidden: !expandedCategories['Transport'],
      valueColor: 'text-red-500',
    },
    {
      key: 'select-category',
      category: 'Select Category',
      jan: '',
      feb: '',
      mar: '',
      q1: '',
      apr: '',
      may: '',
      type: 'category',
      hasChildren: true,
      isExpanded: expandedCategories['Select Category'],
      status: 'warning', // For check/x marks
    },
    {
      key: 'select-category-plan',
      parentCategory: 'Select Category',
      subCategory: 'Bottom-up Plan',
      jan: '-',
      feb: '-',
      mar: '-',
      q1: '-',
      apr: '-',
      may: '-',
      type: 'subcategory',
      isHidden: !expandedCategories['Select Category'],
    },
    {
      key: 'select-category-actual',
      parentCategory: 'Select Category',
      subCategory: 'Actual sum-up',
      jan: '-',
      feb: '-',
      mar: '-',
      q1: '-',
      apr: '-',
      may: '-',
      type: 'subcategory',
      isHidden: !expandedCategories['Select Category'],
      valueColor: 'text-red-500',
    },
  ];

  // Filter out hidden rows
  const visibleData = financialData.filter((item) => !item.isHidden);

  // Define columns
  const columns = [
    {
      title: 'FINANCE CATEGORY',
      dataIndex: 'category',
      key: 'category',
      width: 250,
      render: (text: string, record: any) => {
        if (record.type === 'category' && record.hasChildren) {
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCategory(text)}
                className="text-gray-500 hover:text-gray-700"
              >
                {record.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              <span>{text}</span>
            </div>
          );
        } else if (record.type === 'subcategory') {
          return (
            <div className="pl-6 text-sm">
              <span
                className={cn(
                  record.subCategory.includes('Actual') ? 'text-red-500' : 'text-gray-700',
                )}
              >
                {record.subCategory}
              </span>
            </div>
          );
        }
        return text;
      },
    },
    {
      title: 'JAN',
      dataIndex: 'jan',
      key: 'jan',
      align: 'center',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      title: 'FEB',
      dataIndex: 'feb',
      key: 'feb',
      align: 'center',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      title: 'MAR',
      dataIndex: 'mar',
      key: 'mar',
      align: 'center',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      title: 'Q1',
      dataIndex: 'q1',
      key: 'q1',
      align: 'center',
      className: 'bg-gray-50',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      title: 'APR',
      dataIndex: 'apr',
      key: 'apr',
      align: 'center',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      title: 'MAY',
      dataIndex: 'may',
      key: 'may',
      align: 'center',
      render: (text: string, record: any) => (
        <span className={record.valueColor || ''}>{text}</span>
      ),
    },
    {
      key: 'status',
      width: 80,
      render: (_: any, record: any) => {
        if (record.type === 'category' && record.status) {
          return (
            <div className="flex gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <X className="h-5 w-5 text-red-500" />
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="w-60">
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-lg font-medium"
          />
        </div>

        <div className="w-60">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full border-gray-200 py-2 text-lg font-medium">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full Year">Full Year</SelectItem>
              <SelectItem value="Q1">Q1</SelectItem>
              <SelectItem value="Q2">Q2</SelectItem>
              <SelectItem value="Q3">Q3</SelectItem>
              <SelectItem value="Q4">Q4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="ml-auto">
          <TabsList>
            <TabsTrigger value="Expense" className="px-6">
              Expense
            </TabsTrigger>
            <TabsTrigger value="Income" className="px-6">
              Income
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ReportTable
        columns={columns}
        dataSource={visibleData}
        rowKey="key"
        pagination={false}
        bordered={true}
        layoutBorder={false}
        className="overflow-hidden rounded-lg"
      />
    </div>
  );
}
