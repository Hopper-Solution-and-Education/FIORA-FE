import { ColumnProps } from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/utils';
import { useAppSelector } from '@/store';
import { useMemo } from 'react';
import { HEIGHT_ROW } from '../../data/constants';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import { convertTableDataCurrency } from '../../utils/details/convertTableDataCurrency';
import { getColumnsByPeriod } from '../../utils/details/transformDataForTable';
import { TableData } from '../types/table.type';
import { useBudgetDetailStateContext } from './useBudgetDetailStateContext';

interface UseBudgetColumnsProps {
  handleValidateClick: (record: TableData) => void;
  handleValueChange: (record: TableData, columnKey: string, value: number) => void;
  handleCategorySelected: (rowKey: string, category: Category) => Promise<void>;
  handleRemoveRow?: (record: TableData) => void;
}

export function useBudgetColumns({
  handleValidateClick,
  handleValueChange,
  handleCategorySelected,
  handleRemoveRow,
}: UseBudgetColumnsProps) {
  // Get budget detail state from context
  const {
    state: {
      period,
      periodId,
      activeTab,
      tableData,
      categoryList,
      categoryRows,
      selectedCategories,
      rowLoading,
    },
  } = useBudgetDetailStateContext();

  // Get currency settings from global store
  const { currency, isFullCurrencyDisplay } = useAppSelector((state) => state.settings);

  // Convert table data to display currency format
  const convertedTableData = useMemo(() => {
    return convertTableDataCurrency(tableData, currency, isFullCurrencyDisplay, activeTab);
  }, [tableData, currency, isFullCurrencyDisplay, activeTab]);

  // Get columns configuration based on period type
  const updatedColumns = getColumnsByPeriod({
    period,
    periodId,
    currency,
    categories: categoryList,
    onValueChange: handleValueChange,
    tableData,
    activeTab,
    isFullCurrencyDisplay,
  });

  // Define columns with category selection functionality
  const columnsWithCategorySelect: ColumnProps[] = [
    {
      fixed: 'left',
      title: 'CATEGORY',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (value: any, record: TableData) => {
        // Display as text if category is already created
        if (record.isCreated) {
          return (
            <div
              className={cn(
                `w-full h-[${HEIGHT_ROW}rem] flex items-center gap-2`,
                record.isChild && 'ml-5',
              )}
            >
              {value}
            </div>
          );
        }

        // Display select dropdown for new categories or category rows
        if (categoryRows.includes(record.key) || record.categoryId) {
          // Filter available categories: not created and not already selected
          const availableCategories = categoryList.filter(
            (category: Category) =>
              !category.isCreated &&
              (!selectedCategories.has(category.id) || category.id === record.categoryId),
          );

          return (
            <div className="flex items-center gap-2">
              <Select
                value={record.categoryId || undefined}
                onValueChange={(selectedValue) => {
                  const category = categoryList.find((cat: Category) => cat.id === selectedValue);
                  if (category) {
                    handleCategorySelected(record.key, category);
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
          // Default text display for other cases
          return (
            <div
              className={cn(
                `w-full h-[${HEIGHT_ROW}rem] flex items-center gap-2`,
                record.isChild && 'ml-5',
              )}
            >
              {value}
            </div>
          );
        }
      },
    },
    // Map other columns and hide content for category rows
    ...updatedColumns.slice(1).map((column) => ({
      ...column,
      render: (value: any, record: TableData) => {
        // Hide content for category selection rows
        if (categoryRows.includes(record.key)) {
          return null;
        }
        return column.render ? column.render(value, record, 2) : value;
      },
    })),
  ];

  // Define action column with validation and removal buttons
  const actionColumn: ColumnProps = {
    key: 'action',
    fixed: 'right',
    align: 'center',
    title: 'ACTION',
    width: 60,
    headerAlign: 'center',
    render: (_, record: TableData) => {
      const isLoading = rowLoading && rowLoading[record.key];

      // Determine if check button should be enabled based on record type and state
      const isCheckEnabled = () => {
        // For top-down records, enable only when there are changes
        if (record.key === 'top-down') {
          return record.hasChanges || false;
        }

        // For bottom-up rows, check parent category status
        if (record.key.includes('-bottom-up')) {
          const categoryId = record.key.split('-bottom-up')[0];
          const parentCategory = convertedTableData.find((item) => item.categoryId === categoryId);

          // Always enable if parent category is not created yet
          if (!parentCategory?.isCreated) {
            return true;
          }

          // Enable only when there are changes if parent category is created
          if (parentCategory.isCreated) {
            return record.hasChanges || false;
          }
        }

        // Always enable for newly selected categories (not created yet)
        if (record.categoryId && !record.isCreated) {
          return true;
        }

        // Enable only when there are changes for created categories
        if (record.isCreated) {
          return record.hasChanges || false;
        }

        return false;
      };

      // Render action buttons only for editable records
      if (record.isEditable) {
        return (
          <div className="grid grid-flow-col place-items-center gap-2">
            {/* Remove/Invalid button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50')}
              onClick={() => handleRemoveRow && handleRemoveRow(record)}
            >
              {isLoading ? (
                <Icons.spinner size={15} className="animate-spin" />
              ) : (
                <Icons.close size={15} />
              )}
            </Button>

            {/* Validate/Check button */}
            <div
              className={cn(
                isCheckEnabled() && !isLoading ? 'cursor-pointer' : 'cursor-not-allowed',
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                disabled={!isCheckEnabled() || isLoading}
                className={cn('h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50')}
                onClick={() => {
                  if (isCheckEnabled() && !isLoading) {
                    handleValidateClick?.(record);
                  }
                }}
              >
                {isLoading ? (
                  <Icons.spinner size={15} className="animate-spin" />
                ) : (
                  <Icons.check size={15} />
                )}
              </Button>
            </div>
          </div>
        );
      }

      return null;
    },
  };

  // Return columns configuration and converted table data
  return {
    columns: [...columnsWithCategorySelect, actionColumn],
    convertedTableData,
  };
}
