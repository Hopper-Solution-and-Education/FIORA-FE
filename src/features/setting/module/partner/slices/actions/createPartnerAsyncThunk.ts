// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { partnerDIContainer } from '../../di/partnerDIContainer';
// import { TYPES } from '../../di/partnerDIContainer.type';
// import { Partner } from '../../domain/entities/Partner';
// import { ICreatePartnerUseCase } from '../../domain/usecases/CreatePartnerUsecase';
// import { PartnerFormValues } from '../../presentation/schema/addPartner.schema';

// export const createPartner = createAsyncThunk<Partner, PartnerFormValues, { rejectValue: string }>(
//   'partner/createPartner',
//   async (data, { rejectWithValue }) => {
//     try {
//       const createPartnerUseCase = partnerDIContainer.get<ICreatePartnerUseCase>(
//         TYPES.ICreatePartnerUseCase,
//       );
//       const response = await createPartnerUseCase.execute(data);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Failed to create partner');
//     }
//   },
// );
