import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { GetProductResponse } from '../../domain/entities/Product';
import { IGetProductUseCase } from '../../domain/usecases/GetProductUsecase';

export const getProductsAsyncThunk = createAsyncThunk<
  GetProductResponse, // Return type
  { page: number; pageSize: number },
  { rejectValue: string }
>('product/getProduct', async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const getProductUseCase = productDIContainer.get<IGetProductUseCase>(TYPES.IGetProductUseCase);

    const response = await getProductUseCase.execute(page, pageSize);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to get product');
  }
});
