import { SectionTypeEnum } from '@/features/landing/constants';
import { decorate, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';
import { ISection } from '../../slices/types';

export class GetSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async execute(sectionType: SectionTypeEnum) {
    const response = await this.sectionRepository.getSection(sectionType);
    return this.handleProcessResponse(response);
  }

  private handleProcessResponse(data: ISection): ISection {
    // Preserve the explicit order set by the user
    data.medias.sort((a, b) => a.media_order - b.media_order);
    return data;
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
