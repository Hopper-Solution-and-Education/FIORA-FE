import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { AcknowledgmentMapper } from '../../data/mapper';
import { acknowledgmentDIContainer } from '../../di/acknowledgmentDIContainer';
import { TYPES } from '../../di/acknowledgmentDIContainer.type';
import { ICompleteAcknowledgmentUseCase } from '../../domain/usecases/completeAcknowledgment.usecase';

async function updateCompleteAcknowledgmentHandler(featureId: string, { rejectWithValue }: any) {
  try {
    const completeAcknowledgmentUseCase =
      acknowledgmentDIContainer.get<ICompleteAcknowledgmentUseCase>(
        TYPES.ICompleteAcknowledgmentUseCase,
      );

    const response = await completeAcknowledgmentUseCase.execute(featureId);
    return AcknowledgmentMapper.toCompleteAcknowledgmentResponse(response);
  } catch (error: any) {
    const defaultMessageError = 'Something went wrong';

    toast.error(error?.message || defaultMessageError);

    return rejectWithValue(error?.message || defaultMessageError);
  }
}

export const updateCompleteAcknowledgmentAsyncThunk = createAsyncThunk(
  'acknowledgment/updateCompleteAcknowledgment',
  updateCompleteAcknowledgmentHandler,
);
