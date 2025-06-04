// src/presentation/hooks/useBudgetColumns.ts
import { useEffect, useState } from 'react';
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  BudgetDetailFilterType,
  BudgetPeriodIdType,
  BudgetPeriodType,
  TableData,
} from '../types/table.type';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { getColumnsByPeriod } from '../../utils/transformDataForTable';
import { Currency } from '@/shared/types';

interface UseBudgetColumnsProps {
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  currency: Currency;
  categoryList: Category[];
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
  setTableData: React.Dispatch<React.SetStateAction<TableData[]>>;
  tableData: TableData[];
  handleDeleteCategory: (categoryId: string) => void;
  initialYear: number;
}

export function useBudgetColumns({
  period,
  periodId,
  currency,
  categoryList,
  activeTab,
  categoryRows,
  selectedCategories,
  handleCategoryChange,
  handleValidateClick,
  handleValueChange,
  handleCategorySelected,
  handleRemoveCategory,
  handleDeleteCategory,
  setTableData,
  tableData,
}: UseBudgetColumnsProps) {
  const [columns, setColumns] = useState<ColumnProps[]>([]);

  useEffect(() => {
    const updatedColumns = getColumnsByPeriod(
      period,
      periodId,
      currency,
      categoryList,
      handleCategoryChange,
      handleValidateClick,
      handleValueChange,
      handleDeleteCategory,
      handleRemoveCategory,
      activeTab,
    );

    const columnsWithCategorySelect: ColumnProps[] = [
      {
        title: 'CATEGORY',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        render: (value: string, record: TableData) => {
          if (categoryRows.includes(record.key)) {
            const availableCategories = categoryList.filter(
              (category) =>
                !selectedCategories.has(category.id) || category.id === record.categoryId,
            );

            return (
              <div className="flex items-center gap-2">
                <Select
                  value={record.categoryId || undefined}
                  onValueChange={(selectedValue) => {
                    const category = categoryList.find((cat) => cat.id === selectedValue);
                    if (category) {
                      handleCategorySelected(
                        record.key,
                        selectedValue,
                        setTableData,
                        category.name,
                      );
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
          }

          return (
            <div className="flex items-center justify-between">
              <span>{value}</span>
              {record.isParent && record.categoryId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleRemoveCategory(record.key);
                    // handleDeleteCategory(record.categoryId, activeTab, initialYear);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
      ...updatedColumns.slice(1).map((column) => ({
        ...column,
        render: (value: any, record: TableData) => {
          if (categoryRows.includes(record.key)) {
            return null;
          }
          return column.render ? column.render(value, record, 2) : value;
        },
      })),
    ];

    setColumns(columnsWithCategorySelect);
  }, [period, periodId, currency, categoryList, activeTab, categoryRows, selectedCategories]);

  return { columns };
}
