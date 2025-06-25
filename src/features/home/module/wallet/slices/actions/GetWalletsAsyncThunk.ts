import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IGetWalletsUsecase } from '../../domain/usecase/GetWalletsUsecase';
import type { Wallet } from '../../domain/entity/Wallet';

export const getWalletsAsyncThunk = createAsyncThunk<
  Wallet[],
  void,
  {
    rejectValue: string;
  }
>('wallet/getWallets', async (_, { rejectWithValue }) => {
  try {
    const getWalletsUsecase = walletContainer.get<IGetWalletsUsecase>(
      WALLET_TYPES.IGetWalletsUseCase,
    );

    const wallets = await getWalletsUsecase.execute();

    return wallets;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallets';
    return rejectWithValue(errorMessage);
  }
});
