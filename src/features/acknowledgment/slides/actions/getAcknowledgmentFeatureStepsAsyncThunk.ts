import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { AcknowledgmentMapper } from '../../data/mapper';
import { acknowledgmentDIContainer } from '../../di/acknowledgmentDIContainer';
import { TYPES } from '../../di/acknowledgmentDIContainer.type';
import { IGetAcknowledgmentStepsUseCase } from '../../domain/usecases/getAcknowledgmentSteps.usecase';

async function getAcknowledgmentFeatureStepsHandler(featureId: string, { rejectWithValue }: any) {
  try {
    const getAcknowledgmentFeatureStepsUseCase =
      acknowledgmentDIContainer.get<IGetAcknowledgmentStepsUseCase>(
        TYPES.IGetAcknowledgmentFeatureStepsUseCase,
      );

    const response = await getAcknowledgmentFeatureStepsUseCase.execute(featureId);
    return AcknowledgmentMapper.toGetAcknowledgmentFeatureStepsResponse(response);
  } catch (error: any) {
    const defaultMessageError = 'Something went wrong';

    toast.error(error?.message || defaultMessageError);

    return rejectWithValue(error?.message || defaultMessageError);
  }
}

export const getAcknowledgmentFeatureStepsAsyncThunk = createAsyncThunk(
  'acknowledgment/getAcknowledgmentFeatureSteps',
  getAcknowledgmentFeatureStepsHandler,
);
