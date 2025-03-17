// src/store/slices/categorySlice.ts

import { Category } from '@prisma/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productDIContainer } from '../di/productDIContainer';
import { GetCategoryResponse } from '../domain/entities/Category';
import { GetCategoryUseCase } from '../domain/usecases/GetCategoryUsecase';

interface CategoryState {
  categories: {
    isLoading: boolean;
    data: Category[];
    page: number;
    limit: number;
    total: number;
  };
  error: string | null;
}

const initialState: CategoryState = {
  categories: {
    isLoading: false,
    data: [],
    page: 1,
    limit: 10,
    total: 0,
  },
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ page, pageSize }: { page: number; pageSize: number }) => {
    try {
      const getCategoryUsecase = productDIContainer.get<GetCategoryUseCase>(GetCategoryUseCase);

      const response = await getCategoryUsecase.execute(page, pageSize);
      return response;
    } catch (error) {
      const message = (error as Error).message || 'Failed to fetch categories';
      throw new Error(message);
    }
  },
);

const productManagementSlice = createSlice({
  name: 'productManagement',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categories.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<GetCategoryResponse>) => {
        state.categories = {
          isLoading: false,
          data: action.payload.data,
          page: action.payload.page,
          limit: action.payload.pageSize,
          total: action.payload.totalPage,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default productManagementSlice.reducer;
