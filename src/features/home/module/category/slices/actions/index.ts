import categoryServices from '@/features/home/services/categoryServices';
import { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RawCategory } from '../types';
import { transformCategories } from '../utils';
import { NewCategoryDefaultValues, UpdateCategoryDefaultValues } from '../utils/formSchema';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<RawCategory[]> = await categoryServices.getCategories();
      const transformedData = transformCategories(response.data);
      return { ...response, data: transformedData };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch categories! Please try again!',
      });
    }
  },
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (category: NewCategoryDefaultValues, { rejectWithValue }) => {
    try {
      const response = await categoryServices.createCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to create category! Please try again!',
      });
    }
  },
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (category: UpdateCategoryDefaultValues, { rejectWithValue }) => {
    try {
      const response = await categoryServices.updateCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to update category! Please try again!',
      });
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      return await categoryServices.deleteCategory(id);
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to delete category! Please try again!',
      });
    }
  },
);
