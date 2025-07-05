import { createAsyncThunk } from '@reduxjs/toolkit';
import { walletSettingContainer } from '../../di/walletSettingDIContainer';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain/enum';
import { UpdateDepositRequestStatusResponse } from '../../data/dto/response/UpdateDepositRequestStatusResponse';
import { IUpdateDepositRequestStatusUseCase } from '../../domain';

export const updateDepositRequestStatusAsyncThunk = createAsyncThunk<
  UpdateDepositRequestStatusResponse,
  { id: string; status: DepositRequestStatus },
  { rejectValue: string }
>('walletSetting/updateDepositRequestStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const usecase = walletSettingContainer.get<IUpdateDepositRequestStatusUseCase>(
      WALLET_SETTING_TYPES.IUpdateDepositRequestStatusUseCase,
    );
    const result = await usecase.execute(id, status);
    return result;
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Update deposit request status failed');
  }
});
