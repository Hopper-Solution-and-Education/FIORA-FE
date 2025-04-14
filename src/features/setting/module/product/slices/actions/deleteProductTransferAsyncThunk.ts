import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductTransferDeleteRequest, ProductTransferDeleteResponse } from '../../domain/entities';
import { IDeleteProductTransferUseCase } from '../../domain/usecases';

export const deleteProductTransferAsyncThunk = createAsyncThunk<
  ProductTransferDeleteResponse,
  ProductTransferDeleteRequest,
  { rejectValue: string } // Config type
>('product/deleteProductTransfer', async (data, { rejectWithValue }) => {
  try {
    const deleteProductTransferUseCase = productDIContainer.get<IDeleteProductTransferUseCase>(
      TYPES.IDeleteProductTransferUseCase,
    );

    const response = await deleteProductTransferUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to delete product');
  }
});
