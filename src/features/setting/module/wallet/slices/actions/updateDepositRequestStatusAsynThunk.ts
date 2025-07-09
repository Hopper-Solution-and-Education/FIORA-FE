import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateDepositRequestStatusResponse } from '../../data/dto/response/UpdateDepositRequestStatusResponse';
import { walletSettingContainer } from '../../di/walletSettingDIContainer';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { IUpdateDepositRequestStatusUseCase } from '../../domain';
import { DepositRequestStatus } from '../../domain/enum';

export const updateDepositRequestStatusAsyncThunk = createAsyncThunk<
  UpdateDepositRequestStatusResponse,
  { id: string; status: DepositRequestStatus; remark?: string },
  { rejectValue: string }
>(
  'walletSetting/updateDepositRequestStatus',
  async ({ id, status, remark }, { rejectWithValue }) => {
    try {
      const usecase = walletSettingContainer.get<IUpdateDepositRequestStatusUseCase>(
        WALLET_SETTING_TYPES.IUpdateDepositRequestStatusUseCase,
      );
      const result = await usecase.execute(id, status, remark);
      return result;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Update deposit request status failed');
    }
  },
);
