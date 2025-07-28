import {
  DataSourceItemProps,
  DataSourceProps,
} from '@/components/common/tables/custom-table/types';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Budget } from '../../domain/entities/Budget';
import {
  BudgetDetailFilterType,
  TableData,
  TableRowData,
  TableRowDataWithOriginal,
} from '../../presentation/types/table.type';

export function createGeneralComparisonMapper(
  dataSource: DataSourceProps[],
  comparisonConfig: Array<{
    keyToCompare: string;
    referenceKey: string;
    columns: string[];
    styleWhenGreater: string;
    styleWhenLessOrEqual: string;
    comparisonType?: 'greater' | 'less' | 'equal' | 'greaterOrEqual' | 'lessOrEqual';
  }> | null,
) {
  if (!dataSource || !comparisonConfig) {
    return null;
  }
  const mapper = (rowKey: string, columnId: string, value: any) => {
    // Tìm cấu hình so sánh cho hàng hiện tại
    const config = comparisonConfig.find((cfg) => cfg.keyToCompare === rowKey);
    if (!config || !config.columns.includes(columnId)) {
      return null; // Trả về giá trị gốc nếu không có cấu hình hoặc cột không trong phạm vi
    }

    // Tìm hàng cần so sánh và hàng tham chiếu
    const rowToCompare = findRowByKey(dataSource, config.keyToCompare);
    const referenceRow = findRowByKey(dataSource, config.referenceKey);

    if (!rowToCompare || !referenceRow) {
      return value;
    }

    // Lấy giá trị của cột hiện tại
    const valueToCompare = (rowToCompare[columnId] as DataSourceItemProps)?.value;
    const referenceValue = (referenceRow[columnId] as DataSourceItemProps)?.value;

    // So sánh và áp dụng style
    if (typeof valueToCompare === 'number' && typeof referenceValue === 'number') {
      const comparisonType = config.comparisonType || 'greater';

      switch (comparisonType) {
        case 'greater':
          return valueToCompare > referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
        case 'less':
          return valueToCompare < referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
        case 'equal':
          return valueToCompare === referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
        case 'greaterOrEqual':
          return valueToCompare >= referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
        case 'lessOrEqual':
          return valueToCompare <= referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
        default:
          return valueToCompare > referenceValue
            ? config.styleWhenGreater
            : config.styleWhenLessOrEqual;
      }
    }

    return null;
  };

  // Gán displayName để tránh lỗi
  mapper.displayName = 'ComparisonMapper';
  return mapper;
}

// Hàm tìm hàng theo key
function findRowByKey(data: DataSourceProps[], key: string): DataSourceProps | undefined {
  for (const row of data) {
    if (row.key === key) {
      return row;
    }
    if (row.children) {
      const found = findRowByKey(row.children, key);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

export const getTabType = (tab: BudgetDetailFilterType): 'Expense' | 'Income' => {
  return tab === BudgetDetailFilterEnum.EXPENSE ? 'Expense' : 'Income';
};

// Helper function to get suffix for monthly data
export const getTabSuffix = (tab: BudgetDetailFilterType): '_exp' | '_inc' => {
  return tab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
};

// Helper function to convert Budget to MonthlyPlanningData
export const convertBudgetToMonthlyData = (
  budget: Budget,
  activeTab: BudgetDetailFilterType,
): MonthlyPlanningData => {
  if (!budget) return {};
  const suffix = getTabSuffix(activeTab); // _exp hoặc _inc
  const monthlyData: MonthlyPlanningData = {};

  for (const key in budget) {
    if (Object.prototype.hasOwnProperty.call(budget, key)) {
      // Chỉ lấy các trường đúng suffix hoặc tổng hợp đúng loại
      if (
        key.endsWith(suffix) ||
        (activeTab === BudgetDetailFilterEnum.EXPENSE && key === 'total_exp') ||
        (activeTab === BudgetDetailFilterEnum.INCOME && key === 'total_inc') ||
        (activeTab === BudgetDetailFilterEnum.EXPENSE && key.match(/^q\d_exp$|^h\d_exp$/)) ||
        (activeTab === BudgetDetailFilterEnum.INCOME && key.match(/^q\d_inc$|^h\d_inc$/))
      ) {
        const numValue = Number(budget[key as keyof Budget]);
        monthlyData[key as keyof MonthlyPlanningData] = isNaN(numValue) ? 0 : numValue;
      }
    }
  }

  return monthlyData;
};

// Helper function to create child data with originalData
export const createChildData = (
  key: string,
  type: string,
  data: TableRowData,
  isEditable: boolean,
): TableData => {
  const originalData: TableRowData = {};
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (typeof value === 'object' && value?.value !== undefined) {
      originalData[key] = { value: value.value };
    }
  });

  const result: TableData = {
    key,
    type,
    isChild: true,
    action: true,
    isEditable,
    originalData,
    hasChanges: false,
  };

  // Spread data properties into result
  Object.assign(result, data);

  return result;
};

export const addOriginalDataToTableData = (record: TableData): TableData => {
  const originalData: TableRowData = {};

  Object.keys(record).forEach((key) => {
    const value = record[key];
    if (
      typeof value === 'object' &&
      value !== null &&
      'value' in value &&
      typeof (value as { value: unknown }).value === 'number'
    ) {
      originalData[key] = { value: (value as { value: number }).value };
    }
  });
  return { ...record, originalData, hasChanges: false };
};

// Thêm originalData cho bottomUpData và actualData
export const addOriginalDataToRowData = (record: TableRowData): TableRowDataWithOriginal => {
  const originalData: TableRowData = {};
  Object.keys(record).forEach((key) => {
    if (typeof record[key] === 'object' && record[key]?.value !== null) {
      originalData[key] = { value: record[key].value };
    }
  });
  return { ...record, originalData, hasChanges: false } as TableRowDataWithOriginal;
};
