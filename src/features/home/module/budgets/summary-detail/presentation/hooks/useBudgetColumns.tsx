/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Currency } from '@/shared/types';
import { cn } from '@/shared/utils';
import { useEffect, useState } from 'react';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { getColumnsByPeriod } from '../../utils/transformDataForTable';
import {
  BudgetDetailFilterType,
  BudgetInit,
  BudgetPeriodIdType,
  BudgetPeriodType,
  TableData,
} from '../types/table.type';

interface UseBudgetColumnsProps {
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  table: BudgetInit<TableData>;
  categories: BudgetInit<Category>;
  currency: Currency;
  activeTab: BudgetDetailFilterType;
  categoryRows: string[];
  selectedCategories: Set<string>;
  handleCategoryChange: (categoryId: string, parentKey?: string) => void;
  handleValidateClick: (record: TableData) => void;
  handleValueChange: (record: TableData, columnKey: string, value: number) => void;
  handleCategorySelected: (
    key: string,
    categoryId: string,
    setTableData: React.Dispatch<React.SetStateAction<TableData[]>>,
    categoryName: string,
  ) => void;
  handleRemoveCategory: (categoryId: string) => void;
  handleDeleteCategory: (categoryId: string) => void;
  handleClearTopDown: () => void;
  initialYear: number;
}

export function useBudgetColumns({
  period,
  periodId,
  currency,
  activeTab,
  categoryRows,
  selectedCategories,
  handleCategoryChange,
  handleValidateClick,
  handleValueChange,
  handleCategorySelected,
  handleRemoveCategory,
  handleDeleteCategory,
  handleClearTopDown,
  categories,
  table,
}: UseBudgetColumnsProps) {
  const [columns, setColumns] = useState<ColumnProps[]>([]);

  useEffect(() => {
    const updatedColumns = getColumnsByPeriod(
      period,
      periodId,
      currency,
      categories.data,
      handleCategoryChange,
      handleValidateClick,
      handleValueChange,
      handleDeleteCategory,
      handleRemoveCategory,
      handleClearTopDown,
      table.data,
      activeTab,
    );

    const columnsWithCategorySelect: ColumnProps[] = [
      {
        title: 'CATEGORY',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        render: (value: any, record: TableData) => {
          if (categoryRows.includes(record.key) || record.isCreated) {
            const availableCategories = categories.data.filter(
              (category) =>
                !selectedCategories.has(category.id) || category.id === record.categoryId,
            );

            return (
              <div className="flex items-center gap-2">
                <Select
                  value={(record.categoryId as string) || undefined}
                  onValueChange={(selectedValue) => {
                    const category = categories.data.find((cat) => cat.id === selectedValue);
                    if (category) {
                      handleCategorySelected(record.key, selectedValue, table.set, category.name);
                      handleCategoryChange(selectedValue, record.key);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          } else {
            return (
              <span
                className={cn(
                  'inline-flex items-center font-medium w-full',
                  record.isChild && 'ml-5',
                )}
              >
                {value}
              </span>
            );
          }
        },
      },
      ...updatedColumns.slice(1).map((column) => ({
        ...column,
        render: (value: any, record: any) => {
          if (categoryRows.includes(record.key)) {
            return null;
          }
          return column.render ? column.render(value, record, 2) : value;
        },
      })),
    ];

    setColumns(columnsWithCategorySelect);
  }, [period, periodId, currency, categories.data, activeTab, categoryRows, selectedCategories]);

  return { columns };
}
