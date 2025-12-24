import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { AcknowledgmentFeatureStepRequestDto } from '../../data/dto/request';
import { AcknowledgmentMapper } from '../../data/mapper';
import { acknowledgmentDIContainer } from '../../di/acknowledgmentDIContainer';
import { TYPES } from '../../di/acknowledgmentDIContainer.type';
import { ICreateAcknowledgmentStepsUseCase } from '../../domain/usecases/createAcknowledgmentSteps.usecase';

async function createAcknowledgmentFeatureHandler(
  data: AcknowledgmentFeatureStepRequestDto,
  { rejectWithValue }: any,
) {
  try {
    const createAcknowledgmentFeatureStepsUseCase =
      acknowledgmentDIContainer.get<ICreateAcknowledgmentStepsUseCase>(
        TYPES.ICreateAcknowledgmentFeatureStepsUseCase,
      );

    const response = await createAcknowledgmentFeatureStepsUseCase.execute(data);
    return AcknowledgmentMapper.toCreateAcknowledgmentFeatureStepsResponse(response);
  } catch (error: any) {
    const defaultMessageError = 'Something went wrong';

    toast.error(error?.message || defaultMessageError);

    return rejectWithValue(error?.message || defaultMessageError);
  }
}

export const createAcknowledgmentFeatureStepsAsyncThunk = createAsyncThunk(
  'acknowledgment/createAcknowledgmentFeatureSteps',
  createAcknowledgmentFeatureHandler,
);
