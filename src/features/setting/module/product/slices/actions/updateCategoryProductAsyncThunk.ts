import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { CategoryProductUpdateRequest, CategoryProductUpdateResponse } from '../../domain/entities';
import { IUpdateCategoryProductUseCase } from '../../domain/usecases';

export const updateCategoryProductAsyncThunk = createAsyncThunk<
  CategoryProductUpdateResponse,
  CategoryProductUpdateRequest,
  { rejectValue: string }
>('product/updateCategoryProduct', async (data, { rejectWithValue }) => {
  try {
    const createProductUseCase = productDIContainer.get<IUpdateCategoryProductUseCase>(
      TYPES.IUpdateCategoryProductUseCase,
    );
    const response = await createProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to update product');
  }
});
