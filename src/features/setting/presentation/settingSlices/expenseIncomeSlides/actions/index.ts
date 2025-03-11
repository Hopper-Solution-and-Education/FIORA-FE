import { createAsyncThunk } from '@reduxjs/toolkit';
import expenseIncomeServices from '@/features/setting/services/expenseIncomeServices';
import { Response } from '@/shared/types/Common.types';
import { Category, RawCategory } from '../types';
import { transformCategories } from '../utils';

export const fetchCategories = createAsyncThunk(
  'expenseIncome/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<RawCategory[]> = await expenseIncomeServices.getCategories();
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
  'expenseIncome/createCategory',
  async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const response = await expenseIncomeServices.createCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to create category! Please try again!',
      });
    }
  },
);

export const updateCategory = createAsyncThunk(
  'expenseIncome/updateCategory',
  async (category: Category, { rejectWithValue }) => {
    try {
      const response = await expenseIncomeServices.updateCategory(category);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to update category! Please try again!',
      });
    }
  },
);

export const deleteCategory = createAsyncThunk(
  'expenseIncome/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      return await expenseIncomeServices.deleteCategory(id);
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to delete category! Please try again!',
      });
    }
  },
);
