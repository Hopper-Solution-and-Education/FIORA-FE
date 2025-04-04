import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductDeleteRequest, ProductDeleteResponse } from '../../domain/entities/Product';
import { IDeleteProductUseCase } from '../../domain/usecases/DeleteProductUsecase';

export const deleteProductAsyncThunk = createAsyncThunk<
  ProductDeleteResponse,
  ProductDeleteRequest,
  { rejectValue: string } // Config type
>('product/deleteProduct', async (data, { rejectWithValue }) => {
  try {
    const deleteProductUseCase = productDIContainer.get<IDeleteProductUseCase>(
      TYPES.IDeleteProductUseCase,
    );

    const response = await deleteProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to delete product');
  }
});
