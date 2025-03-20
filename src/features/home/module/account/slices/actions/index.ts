import accountServices from '@/features/home/services/accountServices';
import { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account } from '../types';
import { NewAccountDefaultValues } from '@/features/home/module/account/slices/types/formSchema';

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

export const fetchParents = createAsyncThunk(
  'account/fetchParents',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<Account[]> = await accountServices.fetchParents();
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch parent accounts! Please try again!',
      });
    }
  },
);

export const createAccount = createAsyncThunk(
  'account/createAccount',
  async (data: NewAccountDefaultValues, { rejectWithValue }) => {
    try {
      const response: Response<Account> = await accountServices.createAccount(data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to create account! Please try again!',
      });
    }
  },
);
