import { BaseResponse } from '@/shared/types';
import { decorate, injectable } from 'inversify';
import { IAnnouncementRepository } from '../../data/repositories/annoucementRepository';
import { IAnnouncement } from '../entities/Announcement';

export class GetAnnouncementUseCase {
  private announcementRepository: IAnnouncementRepository;

  constructor(announcementRepository: IAnnouncementRepository) {
    this.announcementRepository = announcementRepository;
  }

  async execute() {
    const response = await this.announcementRepository.getAnnouncement();
    return this.handleProcessResponse(response);
  }

  private handleProcessResponse(
    data: BaseResponse<IAnnouncement[]>,
  ): BaseResponse<IAnnouncement[]> {
    return data;
  }
}

// Apply decorators programmatically
decorate(injectable(), GetAnnouncementUseCase);

// Create a factory function
export const createGetAnnouncementUseCase = (
  announcementRepository: IAnnouncementRepository,
): GetAnnouncementUseCase => {
  return new GetAnnouncementUseCase(announcementRepository);
};
