import { SectionType } from '@prisma/client';
import useSWR from 'swr';
import { MediaRepository } from '../data/repositories/mediaRepository';
import { GetMediaUseCase } from '../domain/use-cases/GetMediaUseCase';

export const useMedia = (sectionType: SectionType) => {
  const { data, error } = useSWR(sectionType, async () => {
    const mediaRepository = MediaRepository.getInstance();
    const response = await GetMediaUseCase.getInstance(mediaRepository).execute(sectionType);
    return response;
  });

  return {
    media: data,
    isLoading: !error && !data,
    isError: error,
  };
};
