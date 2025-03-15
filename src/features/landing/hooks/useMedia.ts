import { SectionType } from '@prisma/client';
import useSWR from 'swr';
import { landingDIContainer } from '../di/landingDIContainer';
import { TYPES } from '../di/landingDIContainer.type';
import { GetMediaUseCase } from '../domain/use-cases/GetMediaUseCase';

export const useMedia = (sectionType: SectionType) => {
  const { data, error } = useSWR(sectionType, async () => {
    // Lấy instance của UseCase từ DI Container
    const getMediaUseCase = landingDIContainer.get<GetMediaUseCase>(TYPES.GetMediaUseCase);

    // Gọi UseCase để lấy dữ liệu
    return await getMediaUseCase.execute(sectionType);
  });

  return {
    media: data,
    isLoading: !error && !data,
    isError: error,
  };
};
