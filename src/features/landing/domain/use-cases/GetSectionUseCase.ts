import { SectionType } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';

export class GetSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  execute(sectionType: SectionType) {
    return this.sectionRepository.getSection(sectionType);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetSectionUseCase);

// Create a factory function
export const createGetSectionUseCase = (
  sectionRepository: ISectionRepository,
): GetSectionUseCase => {
  return new GetSectionUseCase(sectionRepository);
};
