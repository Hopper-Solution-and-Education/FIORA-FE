import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { IGetCategoryProductUseCase } from '../../domain/usecases';

export const fetchCategoriesProduct = createAsyncThunk(
  'product/fetchCategories',
  async ({ page, pageSize }: { page: number; pageSize: number }, { rejectWithValue }) => {
    try {
      const getCategoryUseCase = productDIContainer.get<IGetCategoryProductUseCase>(
        TYPES.IGetCategoryProductUseCase,
      );
      const response = await getCategoryUseCase.execute(page, pageSize);
      return response;
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch category product');
      return rejectWithValue(error || 'Failed to fetch category product');
    }
  },
);
