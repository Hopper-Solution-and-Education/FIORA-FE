import { SectionType } from '@prisma/client';
import useSWR from 'swr';
import { landingDIContainer } from '../di/landingDIContainer';
import { TYPES } from '../di/landingDIContainer.type';
import { GetSectionUseCase } from '../domain/use-cases/GetSectionUseCase';

export const useGetSection = (sectionType: SectionType) => {
  const { data, error } = useSWR(`section-${sectionType}`, async () => {
    const getSectionUseCase = landingDIContainer.get<GetSectionUseCase>(TYPES.GetSectionUseCase);
    return await getSectionUseCase.execute(sectionType);
  });

  return {
    section: data,
    isLoading: !error && !data,
    isError: error,
  };
};
