import { TYPES } from '@/features/admin/di/adminDIContainer.type';
import { inject, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';
import { SectionDefaultValues } from '../../schema/section-form.schema';

@injectable()
export class UpdateSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(@inject(TYPES.ISectionRepository) sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async execute(section: SectionDefaultValues, createdBy: string) {
    return await this.sectionRepository.updateSection(section, createdBy);
  }
}
