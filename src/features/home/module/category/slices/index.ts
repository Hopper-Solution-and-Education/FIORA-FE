// src/features/home/module/category/slices/index.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Response } from '@/shared/types/Common.types';
import {
  fetchCategories,
  searchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from './actions';
import { Category, initialCategoryState } from './types';
import { FilterCriteria } from '@/shared/types';

const categorySlice = createSlice({
  name: 'category',
  initialState: initialCategoryState,
  reducers: {
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
    setFilterCriteria(state, action: PayloadAction<FilterCriteria>) {
      state.filterCriteria = action.payload;
    },
    reset: () => initialCategoryState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.data = action.payload.data.data;
        if (state.maxBalance === 0) {
          state.maxBalance = action.payload.data.maxAmount || 0;
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      .addCase(searchCategories.pending, (state) => {
        state.categories.isLoading = true;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.data = action.payload.data.data;
        if (state.maxBalance === 0) {
          state.maxBalance = action.payload.data.maxAmount || 0;
        }
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
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
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        if (state.categories.data) {
          const updatedCategory = action.payload.data;
          const index = state.categories.data.findIndex((cat) => cat.id === updatedCategory.id);
          if (index !== -1) {
            state.categories.data[index] = updatedCategory;
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.isLoading = false;
        state.categories.data = state.categories.data?.filter((cat) => cat.id !== action.payload);
      });
  },
});

export const {
  setDeleteConfirmOpen,
  setSelectedCategory,
  setCategories,
  setFilterCriteria,
  reset,
} = categorySlice.actions;
export default categorySlice.reducer;
