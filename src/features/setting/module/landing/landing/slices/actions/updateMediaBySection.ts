// src/features/admin/banner/actions/getMediaAction.ts
import { adminContainer } from '@/features/setting/module/landing/di/adminDIContainer';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateSectionUseCase } from '../../domain/usecases/UpdateSectionUseCase';
import { SectionDefaultValues } from '../../schema/section-form.schema';
import { ISection } from '../types';

export const updateMediaBySection = createAsyncThunk<
  ISection, // Return type
  { section: SectionDefaultValues; createdBy: string },
  { rejectValue: string } // Config type
>(
  'banner/updateMediaBySection',
  async (
    { section, createdBy }: { section: SectionDefaultValues; createdBy: string },
    { rejectWithValue },
  ) => {
    try {
      const updateSectionUseCase = adminContainer.get<UpdateSectionUseCase>(UpdateSectionUseCase);
      const sectionResponse = await updateSectionUseCase.execute(section, createdBy);

      return sectionResponse;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Failed to update section');
    }
  },
);
