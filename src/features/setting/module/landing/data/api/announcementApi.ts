import { BaseResponse } from '@/shared/types';
import { decorate, injectable } from 'inversify';
import { IAnnouncement } from '../../domain/entities/Announcement';
import { ApiClient } from '@/config/http-client';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';

interface IAnnouncementAPI {
  fetchAnnouncement(): Promise<BaseResponse<IAnnouncement[]>>;
  updateAnnouncement(announcement: IAnnouncement[]): Promise<BaseResponse<IAnnouncement[]>>;
}

// Define the class without decorators
class AnnouncementAPI implements IAnnouncementAPI {
  private httpClient: ApiClient;

  constructor(httpClient: ApiClient) {
    this.httpClient = httpClient;
  }

  async fetchAnnouncement(): Promise<BaseResponse<IAnnouncement[]>> {
    return await this.httpClient.get<IAnnouncement[]>(ApiEndpointEnum.BannerAnnouncements);
  }

  async updateAnnouncement(announcement: IAnnouncement[]): Promise<BaseResponse<IAnnouncement[]>> {
    return await this.httpClient.put<IAnnouncement[]>(
      ApiEndpointEnum.BannerAnnouncement,
      announcement,
    );
  }
}

// Apply decorators programmatically
decorate(injectable(), AnnouncementAPI);

// Create a factory function that handles the injection
const createAnnouncementAPI = (httpClient: ApiClient): IAnnouncementAPI => {
  return new AnnouncementAPI(httpClient);
};

export { AnnouncementAPI, createAnnouncementAPI };
export type { IAnnouncementAPI };
