import { SectionType } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import type { ISectionRepository } from '../../data/repositories/sectionRepository';
import { ISection } from '../../slices/types';

export class GetSectionUseCase {
  private sectionRepository: ISectionRepository;

  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async execute(sectionType: SectionType) {
    const response = await this.sectionRepository.getSection(sectionType);
    return this.handleProcessResponse(response);
  }

  private handleProcessResponse(data: ISection): ISection {
    data.medias.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
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
