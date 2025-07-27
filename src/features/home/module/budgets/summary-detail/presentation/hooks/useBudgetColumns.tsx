/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnProps } from '@/components/common/tables/custom-table/types';
import { Icons } from '@/components/Icon';
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
  const { currency, isFullCurrencyDisplay } = useAppSelector((state) => state.settings);

  const convertedTableData = useMemo(() => {
    return convertTableDataCurrency(tableData, currency, isFullCurrencyDisplay);
  }, [tableData, currency, isFullCurrencyDisplay]);

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

  const columnsWithCategorySelect: ColumnProps[] = [
    {
      fixed: 'left',
      title: 'CATEGORY',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (value: any, record: TableData) => {
        // Nếu là category đã tạo (isCreated = true), hiển thị text
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

        // Nếu là category mới select (chưa có isCreated) hoặc trong categoryRows, hiển thị select
        if (categoryRows.includes(record.key) || record.categoryId) {
          // Chỉ hiển thị các category chưa được tạo (isCreated = false) và chưa được chọn
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

  const actionColumn: ColumnProps = {
    key: 'action',
    fixed: 'right',
    align: 'center',
    title: 'ACTION',
    width: 60,
    headerAlign: 'center',
    render: (_, record: TableData) => {
      const isLoading = rowLoading && rowLoading[record.key];

      // Logic để xác định có nên enable nút check hay không
      const isCheckEnabled = () => {
        // Nếu là top-down, chỉ enable khi có thay đổi
        if (record.key === 'top-down') {
          return record.hasChanges || false;
        }

        // Nếu là bottom-up row, cần tìm parent category
        if (record.key.includes('-bottom-up')) {
          const categoryId = record.key.split('-bottom-up')[0];
          const parentCategory = convertedTableData.find((item) => item.categoryId === categoryId);

          // Nếu parent category chưa được tạo (isCreated = false hoặc undefined), luôn enable
          if (!parentCategory?.isCreated) {
            return true;
          }

          // Nếu parent category đã được tạo, chỉ enable khi có thay đổi
          if (parentCategory.isCreated) {
            return record.hasChanges || false;
          }
        }

        // Nếu là category mới select (chưa có isCreated), luôn enable
        if (record.categoryId && !record.isCreated) {
          return true;
        }

        // Nếu là category đã tạo (isCreated = true), chỉ enable khi có thay đổi
        if (record.isCreated) {
          return record.hasChanges || false;
        }

        return false;
      };

      if (record.isEditable) {
        return (
          <div className="grid grid-flow-col place-items-center gap-2">
            <span
              className={cn('cursor-pointer', 'text-red-500 hover:text-red-700')}
              title="Invalid"
              onClick={() => handleRemoveRow && handleRemoveRow(record)}
            >
              {isLoading ? (
                <Icons.spinner size={15} className="animate-spin" />
              ) : (
                <Icons.close size={15} />
              )}
            </span>
            <span
              className={cn(
                'cursor-pointer',
                isCheckEnabled() && !isLoading
                  ? 'text-green-500 hover:text-green-700'
                  : 'text-gray-400 cursor-not-allowed',
              )}
              title="Valid"
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
            </span>
          </div>
        );
      }

      return null;
    },
  };

  return {
    columns: [...columnsWithCategorySelect, actionColumn],
    convertedTableData,
  };
}
