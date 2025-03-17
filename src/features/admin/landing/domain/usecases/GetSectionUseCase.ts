import { TYPES } from '@/features/admin/di/adminDIContainer.type';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';

@injectable()
export class GetSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(@inject(TYPES.ISectionRepository) sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async execute(sectionType: SectionType) {
    return await this.sectionRepository.getSection(sectionType);
  }
}
