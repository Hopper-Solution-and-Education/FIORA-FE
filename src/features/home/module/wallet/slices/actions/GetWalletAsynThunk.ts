import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IGetWalletUsecase } from '../../domain/usecase/GetWalletUsecase';
import type { WalletType } from '../../domain/entity/WalletType';
import type { Wallet } from '../../domain/entity/Wallet';

export const getWalletAsyncThunk = createAsyncThunk<
  Wallet,
  WalletType,
  {
    rejectValue: string;
  }
>('wallet/getWallet', async (walletType: WalletType, { rejectWithValue }) => {
  try {
    const getWalletUsecase = walletContainer.get<IGetWalletUsecase>(
      WALLET_TYPES.IGetWalletsUseCase,
    );

    const wallet = await getWalletUsecase.execute(walletType);
    return wallet;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet';
    return rejectWithValue(errorMessage);
  }
});
