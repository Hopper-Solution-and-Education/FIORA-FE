// src/store/slices/categorySlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { CategoryProductPage, GetCategoryResponse } from '../domain/entities/Category';
import { createProduct } from './actions/createProductAsyncThunk';
import { fetchCategoriesProduct } from './actions/fetchCategoriesProduct';
import { getProductsAsyncThunk } from './actions/getProductsAsyncThunk';
import { initialProductState } from './types';

const productManagementSlice = createSlice({
  name: 'productManagement',
  initialState: initialProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesProduct.pending, (state) => {
        state.categories.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoriesProduct.fulfilled,
        (state, action: PayloadAction<GetCategoryResponse>) => {
          const { data, page, pageSize, totalPage } = action.payload;
          state.categories = {
            isLoading: false,
            data: (page === 1
              ? data
              : [...state.categories.data, ...data]) as CategoryProductPage[],
            page: page + 1,
            limit: pageSize,
            total: totalPage,
            hasMore: page < totalPage,
          };
        },
      )
      .addCase(fetchCategoriesProduct.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    builder
      .addCase(createProduct.pending, (state) => {
        state.isCreatingProduct = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.isCreatingProduct = false;
        toast.success('Success', {
          description: 'Create product successfully!!',
        });
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreatingProduct = false;
        toast.error('Failed to create product', {
          description: (state.error = action.error.message || 'Failed to create product'),
        });
      });

    builder
      .addCase(getProductsAsyncThunk.pending, (state) => {
        state.products.isLoading = true;
      })
      .addCase(getProductsAsyncThunk.fulfilled, (state, action) => {
        state.products.isLoading = false;
        state.products.items = action.payload.data;
        state.products.total = action.payload.totalPage;
        state.products.page = action.payload.page;
      })
      .addCase(getProductsAsyncThunk.rejected, (state, action) => {
        state.products.isLoading = false;
        state.error = action.error.message || 'Failed to get products';
      });
  },
});

export default productManagementSlice.reducer;
