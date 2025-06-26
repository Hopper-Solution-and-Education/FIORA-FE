import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IGetAllPackageFXUsecase } from '../../domain/usecase/GetAllPackageFXUsecase';
import type { PackageFX } from '../../domain/entity/PackageFX';

export const getPackageFXAsyncThunk = createAsyncThunk<PackageFX[], void, { rejectValue: string }>(
  'wallet/getPackageFX',
  async (_, { rejectWithValue }) => {
    try {
      const usecase = walletContainer.get<IGetAllPackageFXUsecase>(
        WALLET_TYPES.IGetAllPackageFXUseCase,
      );

      const packageFX = await usecase.execute();

      return packageFX;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch packageFX';
      return rejectWithValue(errorMessage);
    }
  },
);
