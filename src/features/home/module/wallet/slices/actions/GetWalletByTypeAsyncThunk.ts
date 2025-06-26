import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletContainer } from '../../di/walletDIContainer';
import { WALLET_TYPES } from '../../di/walletDIContainer.type';
import type { IGetWalletByTypeUsecase } from '../../domain/usecase/GetWalletByTypeUsecase';
import type { WalletType } from '../../domain/enum';
import type { Wallet } from '../../domain/entity/Wallet';

export const getWalletByTypeAsyncThunk = createAsyncThunk<
  Wallet,
  WalletType,
  {
    rejectValue: string;
  }
>('wallet/getWallet', async (walletType: WalletType, { rejectWithValue }) => {
  try {
    const getWalletByTypeUsecase = walletContainer.get<IGetWalletByTypeUsecase>(
      WALLET_TYPES.IGetWalletByTypeUseCase,
    );

    const wallet = await getWalletByTypeUsecase.execute(walletType);
    return wallet;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wallet';
    return rejectWithValue(errorMessage);
  }
});
