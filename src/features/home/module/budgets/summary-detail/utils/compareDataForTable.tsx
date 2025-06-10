import {
  DataSourceItemProps,
  DataSourceProps,
} from '@/components/common/tables/custom-table/types';

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
