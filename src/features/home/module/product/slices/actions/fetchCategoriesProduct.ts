import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { GetCategoryUseCase } from '../../domain/usecases/GetCategoryUsecase';
import { TYPES } from '../../di/productDIContainer.type';

export const fetchCategoriesProduct = createAsyncThunk(
  'product/fetchCategories',
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
