import useSWR from 'swr';
import { SectionTypeEnum } from '../constants';
import { landingDIContainer } from '../di/landingDIContainer';
import { TYPES } from '../di/landingDIContainer.type';
import { GetMediaUseCase } from '../domain/use-cases/GetMediaUseCase';

export const useMedia = (sectionType: SectionTypeEnum) => {
  const { data, error } = useSWR(`media-${sectionType}`, async () => {
    const getMediaUseCase = landingDIContainer.get<GetMediaUseCase>(TYPES.GetMediaUseCase);
    return await getMediaUseCase.execute(sectionType);
  });

  return {
    media: data,
    isLoading: !error && !data,
    isError: error,
  };
};
