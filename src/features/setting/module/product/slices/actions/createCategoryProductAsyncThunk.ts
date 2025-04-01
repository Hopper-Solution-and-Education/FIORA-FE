import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import {
  CategoryProductCreateRequest,
  CategoryProductCreateResponse,
} from '../../domain/entities/Category';
import { ICreateCategoryProductUseCase } from '../../domain/usecases/CreateCategoryProductUseCase';

export const createCategoryProductAsyncThunk = createAsyncThunk<
  CategoryProductCreateResponse,
  CategoryProductCreateRequest,
  { rejectValue: string }
>('product/createCategoryProduct', async (data, { rejectWithValue }) => {
  try {
    const createCategoryProductUseCase = productDIContainer.get<ICreateCategoryProductUseCase>(
      TYPES.ICreateCategoryProductUseCase,
    );

    const response = await createCategoryProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to create category product');
  }
});
