import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductGetTransactionResponse } from '../../domain/entities';
import { IGetProductTransactionUseCase } from '../../domain/usecases';

export const getProductTransactionAsyncThunk = createAsyncThunk<
  ProductGetTransactionResponse,
  { page: number; pageSize: number; filters?: any; userId: string; search?: string },
  { rejectValue: string }
>(
  'product/getProductTransaction',
  async ({ page, pageSize, filters, userId, search = '' }, { rejectWithValue }) => {
    try {
      const getProductTransactionUseCase = productDIContainer.get<IGetProductTransactionUseCase>(
        TYPES.IGetProductTransactionUseCase,
      );

      const response = await getProductTransactionUseCase.execute(
        page,
        pageSize,
        filters,
        userId,
        search,
      );
      console.log('=====> Check response: ', response);
      return response;
    } catch (error: unknown) {
      let errorMessage = 'Failed to get product transaction';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      return rejectWithValue(errorMessage);
    }
  },
);
