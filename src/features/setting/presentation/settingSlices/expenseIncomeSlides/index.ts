import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchCategories, createCategory, deleteCategory, updateCategory } from './actions';
import { Category, initialExpenseIncomeState } from './types';

const expenseIncomeSlice = createSlice({
  name: 'expenseIncome',
  initialState: initialExpenseIncomeState,
  reducers: {
    setDialogOpen(state, action: PayloadAction<boolean>) {
      state.dialogOpen = action.payload;
    },
    setDeleteConfirmOpen(state, action: PayloadAction<boolean>) {
      state.deleteConfirmOpen = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<Category | null>) {
      state.selectedCategory = action.payload;
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories.data = action.payload;
      state.categories.isLoading = false;
      state.categories.error = null;
    },
    reset: () => initialExpenseIncomeState,
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      });
    // Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          state.categories.data.push(action.payload);
        } else {
          state.categories.data = [action.payload];
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          state.categories.data = state.categories.data.map((cat) =>
            cat.id === action.payload.id ? action.payload : cat,
          );
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      });

    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          state.categories.data = state.categories.data.filter((cat) => cat.id !== action.payload);
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      });
  },
});

export const { setDialogOpen, setDeleteConfirmOpen, setSelectedCategory, setCategories, reset } =
  expenseIncomeSlice.actions;
export default expenseIncomeSlice.reducer;
