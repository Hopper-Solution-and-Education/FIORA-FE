import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { AcknowledgmentMapper } from '../../data/mapper';
import { acknowledgmentDIContainer } from '../../di/acknowledgmentDIContainer';
import { TYPES } from '../../di/acknowledgmentDIContainer.type';
import { ICreateAcknowledgmentFeatureUseCase } from '../../domain/usecases/createAcknowledgment.usecase';

async function createAcknowledgmentFeatureHandler(
  {
    featureKey,
    description,
  }: {
    featureKey: string;
    description?: string;
  },
  { rejectWithValue }: any,
) {
  try {
    const createAcknowledgmentFeatureUseCase =
      acknowledgmentDIContainer.get<ICreateAcknowledgmentFeatureUseCase>(
        TYPES.ICreateAcknowledgmentFeatureUseCase,
      );

    const response = await createAcknowledgmentFeatureUseCase.execute(featureKey, description);
    return AcknowledgmentMapper.toCreateAcknowledgmentFeatureResponse(response);
  } catch (error: any) {
    const defaultMessageError = 'Something went wrong';

    toast.error(error?.message || defaultMessageError);

    return rejectWithValue(error?.message || defaultMessageError);
  }
}

export const createAcknowledgmentFeatureAsyncThunk = createAsyncThunk(
  'acknowledgment/createAcknowledgmentFeature',
  createAcknowledgmentFeatureHandler,
);
