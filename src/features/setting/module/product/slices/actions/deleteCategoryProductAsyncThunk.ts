import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { CategoryProductDeleteRequest, CategoryProductDeleteResponse } from '../../domain/entities';
import { IDeleteCategoryProductUseCase } from '../../domain/usecases';

export const deleteCategoryProductAsyncThunk = createAsyncThunk<
  CategoryProductDeleteResponse,
  CategoryProductDeleteRequest,
  { rejectValue: string } // Config type
>('product/deleteCategoryProduct', async (data, { rejectWithValue }) => {
  try {
    const deleteCategoryProductUseCase = productDIContainer.get<IDeleteCategoryProductUseCase>(
      TYPES.IDeleteCategoryProductUseCase,
    );

    const response = await deleteCategoryProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    toast.error(error?.message || 'Failed to delete category product');
    return rejectWithValue(error || 'Failed to delete category product');
  }
});
