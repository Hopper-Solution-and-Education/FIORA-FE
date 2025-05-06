// src/features/admin/banner/actions/getMediaAction.ts
import { adminContainer } from '@/features/setting/module/landing/di/adminDIContainer';
import { SectionType } from '@prisma/client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetSectionUseCase } from '../../domain/usecases/GetSectionUseCase';
import { ISection } from '../types';

export const fetchMediaBySection = createAsyncThunk<ISection, SectionType, { rejectValue: string }>(
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
