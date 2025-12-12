import type { IHttpClient } from '@/config/http-client/HttpClient';
import { HttpResponse } from '@/shared/types';
import { decorate, injectable } from 'inversify';
import { IAnnouncement } from '../../domain/entities/Announcement';

interface IAnnouncementAPI {
  fetchAnnouncement(): Promise<HttpResponse<IAnnouncement[]>>;
  updateAnnouncement(announcement: IAnnouncement[]): Promise<HttpResponse<IAnnouncement[]>>;
}

// Define the class without decorators
class AnnouncementAPI implements IAnnouncementAPI {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async fetchAnnouncement(): Promise<HttpResponse<IAnnouncement[]>> {
    return await this.httpClient.get<HttpResponse<IAnnouncement[]>>(`/api/announcement`);
  }

  async updateAnnouncement(announcement: IAnnouncement[]): Promise<HttpResponse<IAnnouncement[]>> {
    return await this.httpClient.put<HttpResponse<IAnnouncement[]>>(
      `/api/banners/announcement`,
      announcement,
    );
  }
}

// Apply decorators programmatically
decorate(injectable(), AnnouncementAPI);

// Create a factory function that handles the injection
const createAnnouncementAPI = (httpClient: IHttpClient): IAnnouncementAPI => {
  return new AnnouncementAPI(httpClient);
};

export { AnnouncementAPI, createAnnouncementAPI };
export type { IAnnouncementAPI };
