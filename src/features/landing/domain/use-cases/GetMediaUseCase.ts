import { SectionType } from '@prisma/client';
import { IMediaRepository } from '../interfaces/MediaRepository';

export class GetMediaUseCase {
  private static instance: GetMediaUseCase;
  private MediaRepository: IMediaRepository;

  constructor(MediaRepository: IMediaRepository) {
    this.MediaRepository = MediaRepository;
  }

  public static getInstance(MediaRepository: IMediaRepository): GetMediaUseCase {
    if (!GetMediaUseCase.instance) {
      GetMediaUseCase.instance = new GetMediaUseCase(MediaRepository);
    }
    return GetMediaUseCase.instance;
  }

  async execute(sectionType: SectionType) {
    return await this.MediaRepository.getMediaBySection(sectionType);
  }
}
