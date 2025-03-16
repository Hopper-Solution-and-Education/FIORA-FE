import { inject, injectable } from 'inversify';
import { SectionType } from '@prisma/client';

import { TYPES } from '../../di/landingDIContainer.type';
import type { IMediaRepository } from '../../data/repositories/mediaRepository';

@injectable()
export class GetMediaUseCase {
  private mediaRepository: IMediaRepository;

  constructor(@inject(TYPES.IMediaRepository) mediaRepository: IMediaRepository) {
    this.mediaRepository = mediaRepository;
  }

  execute(sectionType: SectionType) {
    return this.mediaRepository.getMediaBySection(sectionType);
  }
}
