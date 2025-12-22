import { BaseResponse } from '@/shared/types';
import { decorate, injectable } from 'inversify';
import { IAnnouncement } from '../../domain/entities/Announcement';
import { IAnnouncementAPI } from '../api/announcementApi';

export interface IAnnouncementRepository {
  getAnnouncement: () => Promise<BaseResponse<IAnnouncement[]>>;
  updateAnnouncement: (announcement: IAnnouncement[]) => Promise<BaseResponse<IAnnouncement[]>>;
}

// Define the class without decorators
export class AnnouncementRepository implements IAnnouncementRepository {
  private announcementApi: IAnnouncementAPI;

  constructor(announcementApi: IAnnouncementAPI) {
    this.announcementApi = announcementApi;
  }

  async getAnnouncement(): Promise<BaseResponse<IAnnouncement[]>> {
    return await this.announcementApi.fetchAnnouncement();
  }

  async updateAnnouncement(announcement: IAnnouncement[]): Promise<BaseResponse<IAnnouncement[]>> {
    return await this.announcementApi.updateAnnouncement(announcement);
  }
}

// Apply decorators programmatically
decorate(injectable(), AnnouncementRepository);

// Create a factory function that handles the injection
export const createAnnouncementRepository = (
  announcementApi: IAnnouncementAPI,
): IAnnouncementRepository => {
  return new AnnouncementRepository(announcementApi);
};
