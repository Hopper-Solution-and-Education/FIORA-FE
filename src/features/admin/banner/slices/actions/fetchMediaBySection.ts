// src/features/admin/banner/actions/getMediaAction.ts
import { adminContainer } from '@/features/admin/di/adminDIContainer';
import { Section, SectionType } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetSectionUseCase } from '../../domain/usecases/GetSectionUseCase';

export const fetchMediaBySection = createAsyncThunk<Section, SectionType, { rejectValue: string }>(
  'banner/fetchMediaBySection',
  async (sectionType: SectionType, { rejectWithValue }) => {
    try {
      const getMediaUseCase = adminContainer.get<GetSectionUseCase>(GetSectionUseCase);
      const media = await getMediaUseCase.execute(sectionType);

      return media;
    } catch (error) {
      console.log(error);

      return rejectWithValue('Failed to fetch media');
    }
  },
);
