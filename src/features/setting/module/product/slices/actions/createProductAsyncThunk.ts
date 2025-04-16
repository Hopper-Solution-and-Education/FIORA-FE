import { setErrorsFromObject } from '@/shared/lib';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UseFormSetError } from 'react-hook-form';
import { productDIContainer } from '../../di/productDIContainer';
import { TYPES } from '../../di/productDIContainer.type';
import { ProductCreateResponse } from '../../domain/entities';
import { ICreateProductUseCase } from '../../domain/usecases';
import { ProductFormValues } from '../../presentation/schema/addProduct.schema';

export const createProduct = createAsyncThunk<
  ProductCreateResponse, // Return type
  { data: ProductFormValues; setError: UseFormSetError<ProductFormValues> },
  { rejectValue: string } // Config type
>('product/createProduct', async ({ data, setError }, { rejectWithValue }) => {
  try {
    const createProductUseCase = productDIContainer.get<ICreateProductUseCase>(
      TYPES.ICreateProductUseCase,
    );

    const response = await createProductUseCase.execute(data);
    return response;
  } catch (error: any) {
    console.log(error);

    setErrorsFromObject(error.message, setError);
    return rejectWithValue(error || 'Failed to create product');
  }
});
