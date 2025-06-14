import { createAsyncThunk } from '@reduxjs/toolkit';
import { financeDIContainer, TYPES } from '../../di';
import { GetListProductRequest, GetListProductResponse } from '../../domain/entities';
import { IGetAllProductUseCase } from '../../domain/usecases/getAllProductsUseCase';

export const getAllProductAsyncThunk = createAsyncThunk<
  GetListProductResponse,
  GetListProductRequest,
  { rejectValue: string }
>('finance/getAllProduct', async (data, { rejectWithValue }) => {
  try {
    const getAllProductUseCase = financeDIContainer.get<IGetAllProductUseCase>(
      TYPES.IGetAllProductUseCase,
    );

    const response = await getAllProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    return rejectWithValue(error || 'Failed to get all product');
  }
});
