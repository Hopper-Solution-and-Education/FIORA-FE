import { createAsyncThunk } from '@reduxjs/toolkit';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductCreateResponse } from '../../domain/entities/Product';
import { ICreateProductUseCase } from '../../domain/usecases/CreateProductUsecase';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';

export const createProduct = createAsyncThunk<
  ProductCreateResponse, // Return type
  ProductFormValues,
  { rejectValue: string } // Config type
>('product/createProduct', async (data, { rejectWithValue }) => {
  try {
    const createProductUseCase = productDIContainer.get<ICreateProductUseCase>(
      TYPES.ICreateProductUseCase,
    );

    const response = await createProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(error || 'Failed to create product');
  }
});
