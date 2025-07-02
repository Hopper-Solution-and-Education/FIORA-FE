import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import { GetFrozenAmountUsecase } from '../../domain/usecase';

export const fetchFrozenAmountAsyncThunk = createAsyncThunk(
  'wallet/fetchFrozenAmount',
  async (_, { rejectWithValue }) => {
    try {
      const usecase = walletContainer.get<GetFrozenAmountUsecase>(
        WALLET_TYPES.IGetFrozenAmountUseCase,
      );

      return await usecase.execute();
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
