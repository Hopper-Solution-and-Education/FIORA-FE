import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { GetProductTransactionResponse } from '../../domain/entities/Product';
import { IGetProductTransactionUseCase } from '../../domain/usecases/GetProductTransactionUseCase';

export const getProductTransactionAsyncThunk = createAsyncThunk<
  GetProductTransactionResponse, // Return type
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
    console.log(error);

    return rejectWithValue(error || 'Failed to get product transaction');
  }
});
