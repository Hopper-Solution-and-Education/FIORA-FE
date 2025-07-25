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
import { useAppSelector } from '@/store';
import { Check, Loader2, X } from 'lucide-react';
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
  handleCategorySelected: (rowKey: string, category: Category) => Promise<void>;
  handleRemoveCategory: (categoryId: string) => void;
  handleDeleteCategory: (categoryId: string) => void;
  handleClearTopDown: () => void;
  initialYear: number;
  isFullCurrencyDisplay: boolean;
  handleRemoveRow?: (record: TableData) => void;
  rowLoading?: Record<string, boolean>;
}

export function getBudgetColumns({
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
  isFullCurrencyDisplay,
  initialYear,
  handleRemoveRow,
  rowLoading,
}: UseBudgetColumnsProps) {
  const { tableData: originTableData, categoryList: originCategoriesData } = useAppSelector(
    (state) => state.budgetDetail,
  );

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
    originTableData,
    originCategoriesData,
    isFullCurrencyDisplay, // truyền xuống getColumnsByPeriod
  );

  const columnsWithCategorySelect: ColumnProps[] = [
    {
      fixed: 'left',
      title: 'CATEGORY',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (value: any, record: TableData) => {
        if (categoryRows.includes(record.key) || record.isCreated) {
          const availableCategories = categories.data.filter(
            (category: Category) =>
              !selectedCategories.has(category.id) || category.id === record.categoryId,
          );

          return (
            <div className="flex items-center gap-2">
              <Select
                value={record.categoryId || undefined}
                onValueChange={(selectedValue) => {
                  const category = categories.data.find(
                    (cat: Category) => cat.id === selectedValue,
                  );
                  if (category) {
                    handleCategorySelected(record.key, category);
                    handleCategoryChange(selectedValue, record.key);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category: Category) => (
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

  const actionColumn: ColumnProps = {
    key: 'action',
    fixed: 'right',
    align: 'center',
    width: 60,
    headerAlign: 'center',
    render: (_, record: TableData) => {
      const [categoryId] = record.key.split('-bottom-up');

      if (record.isEditable) {
        return (
          <div className="grid grid-flow-col place-items-center gap-2">
            <span
              className={cn('cursor-pointer', 'text-red-500 hover:text-red-700')}
              title="Invalid"
              onClick={() => handleRemoveRow && handleRemoveRow(record)}
            >
              <X size={15} />
            </span>
            <span
              className={cn(
                'cursor-pointer',
                record.isEditable && !rowLoading?.[record.key]
                  ? 'text-green-500 hover:text-green-700'
                  : 'text-gray-400 cursor-not-allowed',
              )}
              title="Valid"
              onClick={() => {
                if (record.isEditable && !rowLoading?.[record.key]) {
                  handleValidateClick?.(record);
                }
              }}
            >
              {/* Hiển thị loading nếu rowLoading[record.key] true */}
              {rowLoading && rowLoading[record.key] ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
            </span>
          </div>
        );
      }

      return null;
    },
  };

  return [...columnsWithCategorySelect, actionColumn];
}
