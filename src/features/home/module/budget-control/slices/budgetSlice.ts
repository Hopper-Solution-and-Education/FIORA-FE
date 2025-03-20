import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export type BudgetType = 'expense' | 'income';

interface BudgetState {
  totalExpense: number;
  totalIncome: number;
  showTable: boolean;
  editableValues: { [key: string]: number };
  editing: { [key: string]: boolean };
  trueExpense: number[];
  trueIncome: number[];
  plannedIncome: { [key: string]: number };
}

const initialState: BudgetState = {
  totalExpense: 0,
  totalIncome: 0,
  showTable: false,
  editableValues: {},
  editing: {},
  trueExpense: new Array(12).fill(0),
  trueIncome: new Array(12).fill(0),
  plannedIncome: {},
};

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    setTotalExpense: (state, action: PayloadAction<number>) => {
      state.totalExpense = action.payload;
    },
    setTotalIncome: (state, action: PayloadAction<number>) => {
      state.totalIncome = action.payload;
    },
    generateBudget: (state) => {
      state.showTable = true;

      const expenseValues: { [key: string]: number } = {};
      const incomeValues: { [key: string]: number } = {};

      MONTHS.forEach((month) => {
        expenseValues[month] = state.totalExpense / 12;
        incomeValues[month] = state.totalIncome / 12;
      });

      state.editableValues = expenseValues;
      state.plannedIncome = incomeValues;
      state.editing = {};
    },
    handleEdit: (
      state,
      action: PayloadAction<{ key: string | number; value: string; type: BudgetType }>,
    ) => {
      const { key, value, type } = action.payload;
      const numValue = Number(value) || 0;

      if (typeof key === 'number') {
        if (type === 'expense') {
          state.trueExpense[key] = numValue;
        } else {
          state.trueIncome[key] = numValue;
        }
      } else {
        if (type === 'expense') {
          state.editableValues[key] = numValue;
        } else {
          state.plannedIncome[key] = numValue;
        }
      }
    },
    toggleEdit: (state, action: PayloadAction<string | number>) => {
      state.editing[action.payload] = true;
    },
    handleBlur: (state, action: PayloadAction<string | number>) => {
      state.editing[action.payload] = false;
    },
  },
});

export const {
  setTotalExpense,
  setTotalIncome,
  generateBudget,
  handleEdit,
  toggleEdit,
  handleBlur,
} = budgetSlice.actions;

export default budgetSlice.reducer;
