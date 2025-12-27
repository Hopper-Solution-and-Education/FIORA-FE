import { NewAccountDefaultValues } from '@/features/home/module/account/slices/types/formSchema';
import accountServices from '@/features/home/services/accountServices';
import { BaseResponse, FilterCriteria } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Account, AccountFilterResponse } from '../types';

export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async (data: FilterCriteria, { rejectWithValue }) => {
    try {
      const response: BaseResponse<AccountFilterResponse> =
        await accountServices.fetchAccounts(data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch accounts! Please try again!',
      });
    }
  },
);

export const searchAccounts = createAsyncThunk(
  'account/searchAccounts',
  async (data: FilterCriteria, { rejectWithValue }) => {
    try {
      const response: BaseResponse<AccountFilterResponse> =
        await accountServices.fetchAccounts(data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to search accounts! Please try again!',
      });
    }
  },
);

export const fetchParents = createAsyncThunk(
  'account/fetchParents',
  async (data: FilterCriteria, { rejectWithValue }) => {
    try {
      const response: BaseResponse<AccountFilterResponse> =
        await accountServices.fetchParents(data);
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
      const response: BaseResponse<Account> = await accountServices.createAccount(data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to create account! Please try again!',
      });
    }
  },
);

export const updateAccount = createAsyncThunk(
  'account/updateAccount',
  async (
    { id, data }: { id: string; data: Partial<NewAccountDefaultValues> },
    { rejectWithValue },
  ) => {
    try {
      const response: BaseResponse<Account> = await accountServices.updateAccount(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to update account! Please try again!',
      });
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'account/deleteAccount',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: BaseResponse<Account> = await accountServices.deleteAccount(id);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to delete account! Please try again!',
      });
    }
  },
);
