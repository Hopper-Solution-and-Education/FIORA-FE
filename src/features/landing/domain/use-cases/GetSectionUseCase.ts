import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';

import type { ISectionRepository } from '../../data/repositories/sectionRepository';
import { TYPES } from '../../di/landingDIContainer.type';

@injectable()
export class GetSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(@inject(TYPES.ISectionRepository) sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  execute(sectionType: SectionType) {
    return this.sectionRepository.getSection(sectionType);
  }
}
