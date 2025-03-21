import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { DeleteProductRequest, DeleteProductResponse } from '../../domain/entities/Product';
import { IDeleteProductUseCase } from '../../domain/usecases/DeleteProductUsecase';

export const deleteProductAsyncThunk = createAsyncThunk<
  DeleteProductResponse,
  DeleteProductRequest,
  { rejectValue: string } // Config type
>('product/deleteProduct', async (data, { rejectWithValue }) => {
  try {
    const deleteProductUseCase = productDIContainer.get<IDeleteProductUseCase>(
      TYPES.IDeleteProductUseCase,
    );

    const response = await deleteProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to delete product');
  }
});
