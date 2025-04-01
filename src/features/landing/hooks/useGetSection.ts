import { SectionType } from '@prisma/client';
import useSWR, { SWRConfiguration } from 'swr';
import { landingDIContainer } from '../di/landingDIContainer';
import { TYPES } from '../di/landingDIContainer.type';
import { GetSectionUseCase } from '../domain/use-cases/GetSectionUseCase';

export const useGetSection = (sectionType: SectionType, swrOptions?: SWRConfiguration) => {
  const { data, error } = useSWR(
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
