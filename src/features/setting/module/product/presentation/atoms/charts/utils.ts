/* eslint-disable @typescript-eslint/no-unused-vars */
import { ProductFormValues } from '../../schema/addProduct.schema';

export type BarItem = {
  id?: string;
  name: string;
  description: string;
  taxRate: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  color?: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
  product?: ProductFormValues;
  expense?: number;
  income?: number;
};

export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};

interface ProcessedBarItem extends BarItem {
  depth: number;
  color: string;
  parent?: string;
  isChild: boolean;
  expense: number;
  income: number;
  value: number;
  icon?: string;
}

// Process raw data into chartData
export const processChartData = (
  data: BarItem[],
  levelConfig?: LevelConfig,
): ProcessedBarItem[] => {
  let totalIncome = 0;
  let totalExpense = 0;
  const groupedData: Record<string, BarItem> = {};

  // Process each item (parent or child)
  const processItem = (item: BarItem, isChild: boolean = false): void => {
    if (!groupedData[item.name]) {
      groupedData[item.name] = { ...item, isChild };
    }

    // Assign income/expense based on type and value
    if (item.type === 'expense') {
      groupedData[item.name].expense = -Math.abs(item.value ?? 0);
      if (!isChild) totalExpense += item.value ?? 0;
    } else if (item.type === 'income') {
      groupedData[item.name].income = item.value ?? 0;
      if (!isChild) totalIncome += item.value ?? 0;
    }

    // Process children
    if (item.children && item.children.length > 0) {
      groupedData[item.name].children = item.children.map((child) => {
        processItem(child, true);
        return { ...child, parent: item.name, isChild: true };
      });
    }
  };

  // Process all top-level items
  data.forEach((item) => processItem(item));

  const totalName = levelConfig?.totalName || 'Total';
  const totalColor = levelConfig?.colors[0] || '#888888';

  return [
    {
      name: totalName,
      expense: -totalExpense,
      income: totalIncome,
      type: 'total',
      children: [],
      color: totalColor,
      depth: 0,
      isChild: false,
      value: 0,
      description: '',
      taxRate: 0,
      createdAt: '',
      updatedAt: '',
    },
    ...Object.entries(groupedData)
      .filter(([_, values]) => !values.isChild)
      .map(([name, values]) => ({
        id: values.id,
        description: values.description,
        taxRate: values.taxRate,
        name,
        expense: values.expense ?? 0,
        income: values.income ?? 0,
        type: 'product',
        children: values.children || [],
        color: values.color || '#888888',
        depth: 0,
        product: values.product,
        icon: values.icon,
        createdAt: values.createdAt,
        updatedAt: values.updatedAt,
        value: values.value,
        isChild: false,
      })),
  ];
};

// Process chartData into visibleData for rendering
export const processVisibleData = (
  chartData: ProcessedBarItem[],
  expandedItems: Record<string, boolean>,
  levelConfig: LevelConfig | undefined,
  getIcon: (item: BarItem) => string | null,
): ProcessedBarItem[] => {
  const flattenedData: ProcessedBarItem[] = [];

  const buildProcessedData = (items: ProcessedBarItem[], depth: number = 0): void => {
    items.forEach((item) => {
      const currentItem: ProcessedBarItem = {
        ...item,
        depth,
        color: item.color || levelConfig?.colors[depth] || '#888888',
        parent: item.parent || undefined,
        isChild: !!item.parent,
        expense: 0,
        income: 0,
        product: item.product,
        type: item.type || 'product',
        icon: getIcon(item) || undefined,
      };

      // Prioritize using item's own income/expense
      if (item.income !== undefined || item.expense !== undefined) {
        currentItem.income = item.income ?? 0;
        currentItem.expense = item.expense ? -Math.abs(item.expense) : 0;
      }

      flattenedData.push(currentItem);

      if (expandedItems[item.name] && item.children && item.children.length > 0) {
        buildProcessedData(item.children as ProcessedBarItem[], depth + 1);
      }
    });
  };

  buildProcessedData(chartData);
  return flattenedData;
};
