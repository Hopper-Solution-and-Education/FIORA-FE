import { decorate, injectable } from 'inversify';
import { SectionTypeEnum } from '../../constants';
import type { IMediaRepository } from '../../data/repositories/mediaRepository';

export class GetMediaUseCase {
  private mediaRepository: IMediaRepository;

  constructor(mediaRepository: IMediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  async execute(sectionType: SectionTypeEnum) {
    return await this.mediaRepository.getMediaBySection(sectionType);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetMediaUseCase);

// Create a factory function
export const createGetMediaUseCase = (mediaRepository: IMediaRepository): GetMediaUseCase => {
  return new GetMediaUseCase(mediaRepository);
};
