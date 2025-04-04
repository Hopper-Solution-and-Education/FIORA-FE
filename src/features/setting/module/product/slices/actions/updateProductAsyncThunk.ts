import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductUpdateRequest, ProductUpdateResponse } from '../../domain/entities/Product';
import { IUpdateProductUseCase } from '../../domain/usecases/UpdateProductUsecase';

export const updateProductAsyncThunk = createAsyncThunk<
  ProductUpdateResponse,
  ProductUpdateRequest,
  { rejectValue: string }
>('product/updateProduct', async (data: ProductUpdateRequest, { rejectWithValue }) => {
  try {
    const createProductUseCase = productDIContainer.get<IUpdateProductUseCase>(
      TYPES.IUpdateProductUseCase,
    );
    const response = await createProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to update product');
  }
});
