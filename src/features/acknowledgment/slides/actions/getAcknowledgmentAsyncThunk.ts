import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { AcknowledgmentMapper } from '../../data/mapper';
import { acknowledgmentDIContainer } from '../../di/acknowledgmentDIContainer';
import { TYPES } from '../../di/acknowledgmentDIContainer.type';
import { IGetAcknowledgmentUseCase } from '../../domain/usecases/getAcknowledgment.usecase';

async function getAcknowledgmentHandler(isCompleted: boolean, { rejectWithValue }: any) {
  try {
    const getAcknowledgmentUseCase = acknowledgmentDIContainer.get<IGetAcknowledgmentUseCase>(
      TYPES.IGetAcknowledgmentUseCase,
    );

    const response = await getAcknowledgmentUseCase.execute(isCompleted);
    return AcknowledgmentMapper.toGetAcknowledgmentResponse(response);
  } catch (error: any) {
    const defaultMessage = 'fail to get acknowledgment';

    toast.error(error?.message || defaultMessage);
    return rejectWithValue(error?.message || defaultMessage);
  }
}

export const getAcknowledgmentAsyncThunk = createAsyncThunk(
  'acknowledgment/getAcknowledgmentAsyncThunk',
  getAcknowledgmentHandler,
);
