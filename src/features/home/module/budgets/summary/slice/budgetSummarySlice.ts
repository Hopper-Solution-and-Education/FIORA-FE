import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BudgetType } from '@prisma/client';
import { Budget } from '../domain/entities/Budget';
// Import the thunk

export interface BudgetSummaryState {
  topBudget: Budget | null;
  botBudget: Budget | null;
  actBudget: Budget | null;
  allBudgets: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetSummaryState = {
  topBudget: null,
  botBudget: null,
  actBudget: null,
  allBudgets: [],
  loading: false,
  error: null,
};

const budgetSummarySlice = createSlice({
  name: 'budgetSummary',
  initialState,
  reducers: {
    fetchBudgetSummaryStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBudgetSummarySuccess(
      state,
      action: PayloadAction<{
        topBudget: Budget | null;
        botBudget: Budget | null;
        actBudget: Budget | null;
        allBudgets: Budget[];
      }>,
    ) {
      state.loading = false;
      state.topBudget = action.payload.topBudget;
      state.botBudget = action.payload.botBudget;
      state.actBudget = action.payload.actBudget;
      state.allBudgets = action.payload.allBudgets;
    },
    fetchBudgetSummaryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateBudgetByType(state, action: PayloadAction<{ type: BudgetType; budget: Budget }>) {
      const { type, budget } = action.payload;

      if (type === BudgetType.Top) {
        state.topBudget = budget;
      } else if (type === BudgetType.Bot) {
        state.botBudget = budget;
      } else if (type === BudgetType.Act) {
        state.actBudget = budget;
      }

      const index = state.allBudgets.findIndex((b) => b.type === type);
      if (index !== -1) {
        state.allBudgets[index] = budget;
      } else {
        state.allBudgets.push(budget);
      }
    },
    resetBudgetSummary(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  fetchBudgetSummaryStart,
  fetchBudgetSummarySuccess,
  fetchBudgetSummaryFailure,
  updateBudgetByType,
  resetBudgetSummary,
} = budgetSummarySlice.actions;

export default budgetSummarySlice.reducer;
