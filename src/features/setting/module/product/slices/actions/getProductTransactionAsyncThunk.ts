import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductGetTransactionResponse } from '../../domain/entities';
import { IGetProductTransactionUseCase } from '../../domain/usecases';

export const getProductTransactionAsyncThunk = createAsyncThunk<
  ProductGetTransactionResponse,
  { page: number; pageSize: number; userId: string },
  { rejectValue: string }
>('product/getProductTransaction', async ({ page, pageSize, userId }, { rejectWithValue }) => {
  try {
    const getProductTransactionUseCase = productDIContainer.get<IGetProductTransactionUseCase>(
      TYPES.IGetProductTransactionUseCase,
    );

    const response = await getProductTransactionUseCase.execute(page, pageSize, userId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to get product transaction');
  }
});
