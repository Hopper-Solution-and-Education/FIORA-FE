import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { IGetCategoryProductUseCase } from '../../domain/usecases/GetCategoryProductUseCase';

export const fetchCategoriesProduct = createAsyncThunk(
  'product/fetchCategories',
  async ({ page, pageSize }: { page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const getCategoryUseCase = productDIContainer.get<IGetCategoryProductUseCase>(
        TYPES.IGetCategoryProductUseCase,
      );
      const response = await getCategoryUseCase.execute(page, pageSize);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch category product');
    }
  },
);
