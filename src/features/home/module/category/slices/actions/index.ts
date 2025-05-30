import categoryServices from '@/features/home/services/categoryServices';
import { FilterCriteria, GlobalFilters } from '@/shared/types';
import { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CategoryFilterResponse } from '../types';
import { transformCategories } from '../utils';
import { NewCategoryDefaultValues, UpdateCategoryDefaultValues } from '../utils/formSchema';

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (filterCriteria: FilterCriteria, { rejectWithValue }) => {
    try {
      const response: Response<CategoryFilterResponse> =
        await categoryServices.getCategories(filterCriteria);
      const transformedData = transformCategories(response.data.data);
      return { ...response, data: { ...response.data, data: transformedData } };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch categories! Please try again!',
      });
    }
  },
);

export const searchCategories = createAsyncThunk(
  'category/searchCategories',
  async (globalFilters: GlobalFilters, { rejectWithValue }) => {
    try {
      const response: Response<CategoryFilterResponse> =
        await categoryServices.searchCategories(globalFilters);
      const transformedData = transformCategories(response.data.data);
      return { ...response, data: { ...response.data, data: transformedData } };
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to search categories! Please try again!',
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
  async (
    {
      id,
      newCategoryId,
    }: {
      id: string;
      newCategoryId?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await categoryServices.deleteCategory(id, newCategoryId);
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to delete category! Please try again!',
      });
    }
  },
);
