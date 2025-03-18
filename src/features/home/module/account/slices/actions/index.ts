import accountServices from '@/features/home/services/accountServices';
import { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from '../types';

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<Account[]> = await accountServices.fetchAccounts();
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch accounts! Please try again!',
      });
    }
  },
);
