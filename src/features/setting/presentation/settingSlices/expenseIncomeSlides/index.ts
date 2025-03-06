import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Response } from '@/shared/types/Common.types';
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
    setCategories(state, action: PayloadAction<Response<Category[]>>) {
      state.categories.data = action.payload.data;
      state.categories.isLoading = false;
      state.categories.error = null;
    },
    reset: () => initialExpenseIncomeState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.data = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      // Rest of the extraReducers remain the same
      .addCase(createCategory.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          const newCategory = action.payload.data;
          if (!newCategory.parentId) {
            state.categories.data.push(newCategory);
          } else {
            const parent = state.categories.data.find((cat) => cat.id === newCategory.parentId);
            if (parent) {
              parent.subCategories.push(newCategory);
            }
          }
        } else {
          state.categories.data = [action.payload.data];
        }
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      // Update and delete cases remain largely the same but should consider hierarchy
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          const updateCategoryInArray = (categories: Category[]): void => {
            for (let i = 0; i < categories.length; i++) {
              if (categories[i].id === action.payload.data.id) {
                categories[i] = action.payload.data;
                return;
              }
              updateCategoryInArray(categories[i].subCategories);
            }
          };
          updateCategoryInArray(state.categories.data);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          const removeCategoryFromArray = (categories: Category[]): Category[] => {
            return categories.filter((cat) => {
              cat.subCategories = removeCategoryFromArray(cat.subCategories);
              return cat.id !== action.payload;
            });
          };
          state.categories.data = removeCategoryFromArray(state.categories.data);
        }
      });
  },
});

export const { setDialogOpen, setDeleteConfirmOpen, setSelectedCategory, setCategories, reset } =
  expenseIncomeSlice.actions;
export default expenseIncomeSlice.reducer;
