'use client';
import { SWRConfiguration } from 'swr';
import { useCustomSWR } from '@/config/swr/swrConfig';
import { SectionTypeEnum } from '../constants';
import { landingDIContainer } from '../di/landingDIContainer';
import { TYPES } from '../di/landingDIContainer.type';
import { GetSectionUseCase } from '../domain/use-cases/GetSectionUseCase';

export const useGetSection = (sectionType: SectionTypeEnum, swrOptions?: SWRConfiguration) => {
  const { data, error } = useCustomSWR(
    `section-${sectionType}`,
    async () => {
      const getSectionUseCase = landingDIContainer.get<GetSectionUseCase>(TYPES.GetSectionUseCase);
      return await getSectionUseCase.execute(sectionType);
    },
    swrOptions,
  );

  return {
    section: data,
    isLoading: !error && !data,
    isError: error,
  };
};
