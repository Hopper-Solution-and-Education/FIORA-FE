import { BudgetDetailFilterEnum } from '../../data/constants';
import { Category } from '../../data/dto/response/CategoryResponseDTO';
import {
  BudgetDetailFilterType,
  BudgetPeriodIdType,
  BudgetPeriodType,
  TableData,
} from '../types/table.type';

export interface BudgetDetailState {
  tableData: TableData[];
  categoryList: Category[];
  categoryRows: string[];
  selectedCategories: Set<string>;
  isLoading: boolean;
  period: BudgetPeriodType;
  periodId: BudgetPeriodIdType;
  activeTab: BudgetDetailFilterType;
  rowLoading: Record<string, boolean>;
  expand: boolean;
}

export type BudgetDetailAction =
  | { type: 'SET_TABLE_DATA'; payload: TableData[] }
  | { type: 'SET_CATEGORY_LIST'; payload: Category[] }
  | { type: 'ADD_CATEGORY_ROW'; payload: string }
  | { type: 'REMOVE_CATEGORY_ROW'; payload: string }
  | { type: 'SET_SELECTED_CATEGORIES'; payload: Set<string> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PERIOD'; payload: BudgetPeriodType }
  | { type: 'SET_PERIOD_ID'; payload: BudgetPeriodIdType }
  | { type: 'SET_ACTIVE_TAB'; payload: BudgetDetailFilterType }
  | { type: 'RESET_BUDGET_DETAIL_STATE' }
  | { type: 'ADD_EMPTY_CATEGORY_ROW'; payload: string }
  | { type: 'SET_CATEGORY_SELECTED'; payload: { rowKey: string; category: Category } }
  | {
      type: 'SET_CATEGORY_CHILD_DATA';
      payload: { rowKey: string; bottomUpData: any; actualData: any };
    }
  | { type: 'SET_ROW_LOADING'; payload: { rowKey: string; loading: boolean } }
  | { type: 'SET_EXPAND'; payload: boolean };

export const initialBudgetDetailState: BudgetDetailState = {
  tableData: [],
  categoryList: [],
  categoryRows: [],
  selectedCategories: new Set(),
  isLoading: false,
  period: 'year',
  periodId: 'year',
  activeTab: BudgetDetailFilterEnum.EXPENSE,
  rowLoading: {},
  expand: false,
};

export function budgetDetailReducer(
  state: BudgetDetailState,
  action: BudgetDetailAction,
): BudgetDetailState {
  switch (action.type) {
    case 'SET_TABLE_DATA':
      return { ...state, tableData: action.payload };
    case 'SET_CATEGORY_LIST':
      return { ...state, categoryList: action.payload };
    case 'ADD_CATEGORY_ROW':
      return { ...state, categoryRows: [...state.categoryRows, action.payload] };
    case 'REMOVE_CATEGORY_ROW':
      return { ...state, categoryRows: state.categoryRows.filter((id) => id !== action.payload) };
    case 'SET_SELECTED_CATEGORIES':
      return { ...state, selectedCategories: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PERIOD':
      return { ...state, period: action.payload };
    case 'SET_PERIOD_ID':
      return { ...state, periodId: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'RESET_BUDGET_DETAIL_STATE':
      return { ...initialBudgetDetailState };
    case 'ADD_EMPTY_CATEGORY_ROW':
      return {
        ...state,
        tableData: [
          ...state.tableData.slice(0, 3), // Keep first 3 rows (Top Down, Bottom Up, Actual Sum Up)
          {
            key: action.payload,
            type: '',
            categoryId: '',
            category: { value: '' },
            isParent: true,
            action: true,
          },
          ...state.tableData.slice(3), // Add remaining rows after the new category
        ],
        categoryRows: [...state.categoryRows, action.payload],
      };
    case 'SET_CATEGORY_SELECTED':
      return {
        ...state,
        tableData: state.tableData.map((item) => {
          if (item.key === action.payload.rowKey) {
            const category = action.payload.category;
            return {
              ...item,
              type: category.name,
              categoryId: category.id,
              category: { value: category.name },
              children: [
                {
                  key: `${category.id}-bottom-up`,
                  type: 'Bottom Up',
                  isChild: true,
                  action: true,
                  isEditable: true,
                },
                {
                  key: `${category.id}-actual`,
                  type: 'Actual Sum Up',
                  isChild: true,
                  action: true,
                  isEditable: false,
                },
              ],
            };
          }
          return item;
        }),
      };
    case 'SET_CATEGORY_CHILD_DATA':
      return {
        ...state,
        tableData: state.tableData.map((item) => {
          if (item.key === action.payload.rowKey && item.children) {
            const [bottomUp, actual] = item.children;
            return {
              ...item,
              children: [
                {
                  ...bottomUp,
                  ...action.payload.bottomUpData,
                },
                {
                  ...actual,
                  ...action.payload.actualData,
                },
              ],
            };
          }
          return item;
        }),
      };
    case 'SET_ROW_LOADING':
      return {
        ...state,
        rowLoading: { ...state.rowLoading, [action.payload.rowKey]: action.payload.loading },
      };
    case 'SET_EXPAND':
      return { ...state, expand: action.payload };
    default:
      return state;
  }
}
