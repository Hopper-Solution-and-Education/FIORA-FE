import { decorate, injectable } from 'inversify';
import { IAnnouncementRepository } from '../../data/repositories/annoucementRepository';
import { IAnnouncement } from '../entities/Announcement';

export class UpdateAnnouncementUseCase {
  private announcementRepository: IAnnouncementRepository;

  constructor(announcementRepository: IAnnouncementRepository) {
    this.announcementRepository = announcementRepository;
  }

  async execute(announcement: IAnnouncement[]) {
    const response = await this.announcementRepository.updateAnnouncement(announcement);
    return response;
  }
}

// Apply decorators programmatically
decorate(injectable(), UpdateAnnouncementUseCase);

// Create a factory function
export const createUpdateAnnouncementUseCase = (
  announcementRepository: IAnnouncementRepository,
): UpdateAnnouncementUseCase => {
  return new UpdateAnnouncementUseCase(announcementRepository);
};
