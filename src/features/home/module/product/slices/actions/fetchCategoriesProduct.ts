import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { IGetCategoryUseCase } from '../../domain/usecases/GetCategoryUsecase';

export const fetchCategoriesProduct = createAsyncThunk(
  'product/fetchCategories',
  async ({ page, pageSize }: { page: number; pageSize: number }) => {
    try {
      const getCategoryUseCase = productDIContainer.get<IGetCategoryUseCase>(
        TYPES.IGetCategoryUseCase,
      );
      const response = await getCategoryUseCase.execute(page, pageSize);
      return response;
    } catch (error) {
      const message = (error as Error).message || 'Failed to fetch categories';
      throw new Error(message);
    }
  },
);
