import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { CategoryProductCreateRequest, CategoryProductCreateResponse } from '../../domain/entities';
import { ICreateCategoryProductUseCase } from '../../domain/usecases';

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
    toast.error(error?.message || 'Failed to create category product');
    return rejectWithValue(error || 'Failed to create category product');
  }
});
