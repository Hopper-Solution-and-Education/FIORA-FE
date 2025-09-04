import { Category } from '@/features/home/module/budgets/summary-detail/data/dto/response/CategoryResponseDTO';
import { TableData } from '@/features/home/module/budgets/summary-detail/presentation/types/table.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BudgetDetailStateType } from '../types/budget-detail.type';

const initialState: BudgetDetailStateType = {
  tableData: [],
  categoryList: [],
};

const budgetDetailSlice = createSlice({
  name: 'budgetDetail',
  initialState,
  reducers: {
    // Table data actions
    setTableDataSlice: (state, action: PayloadAction<TableData[]>) => {
      state.tableData = action.payload;
    },
    clearTableDataSlice: (state) => {
      state.tableData = [];
    },

    // Category data actions
    setCategoryListSlice: (state, action: PayloadAction<Category[]>) => {
      state.categoryList = action.payload;
    },
    clearCategoryListSlice: (state) => {
      state.categoryList = [];
    },

    // Reset actions
    resetBudgetDetailState: () => {
      return { ...initialState };
    },
    resetTableDataSlice: (state) => {
      state.tableData = [];
    },
    resetCategoriesSlice: (state) => {
      state.categoryList = [];
    },
  },
});

export const {
  // Table data actions
  setTableDataSlice,
  clearTableDataSlice,

  // Category data actions
  setCategoryListSlice,
  clearCategoryListSlice,

  // Reset actions
  resetBudgetDetailState,
  resetTableDataSlice,
  resetCategoriesSlice,
} = budgetDetailSlice.actions;

export default budgetDetailSlice.reducer;
