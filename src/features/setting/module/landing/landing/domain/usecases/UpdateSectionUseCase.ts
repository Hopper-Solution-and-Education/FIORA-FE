import { decorate, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';
import { SectionDefaultValues } from '../../schema/section-form.schema';

export class UpdateSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async execute(section: SectionDefaultValues, createdBy: string) {
    return await this.sectionRepository.updateSection(section, createdBy);
  }
}

// Apply decorators programmatically
decorate(injectable(), UpdateSectionUseCase);

// Create a factory function
export const createUpdateSectionUseCase = (
  sectionRepository: ISectionRepository,
): UpdateSectionUseCase => {
  return new UpdateSectionUseCase(sectionRepository);
};
