// src/store/slices/categorySlice.ts

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { productDIContainer } from '../di/productDIContainer';
import { TYPES } from '../di/productDIContainer.type';
import { CategoryProductPage, GetCategoryResponse } from '../domain/entities/Category';
import { GetCategoryUseCase } from '../domain/usecases/GetCategoryUsecase';

interface CategoryState {
  categories: {
    isLoading: boolean;
    data: CategoryProductPage[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  error: string | null;
}

const initialState: CategoryState = {
  categories: {
    isLoading: false,
    data: [],
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ page, pageSize }: { page: number; pageSize: number }) => {
    try {
      const getCategoryUsecase = productDIContainer.get<GetCategoryUseCase>(
        TYPES.IGetCategoryUseCase,
      );

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
      .addCase(fetchCategories.pending, (state, action) => {
        state.categories.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<GetCategoryResponse>) => {
        const { data, page, pageSize, totalPage } = action.payload;

        state.categories = {
          isLoading: false,
          data: page === 1 ? data : [...state.categories.data, ...data],
          page: page,
          limit: pageSize,
          total: totalPage,
          hasMore: page * pageSize < totalPage, // Cập nhật hasMore
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export default productManagementSlice.reducer;
