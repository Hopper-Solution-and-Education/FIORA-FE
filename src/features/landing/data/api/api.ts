import type { IHttpClient } from '@/config/http-client/HttpClient';
import { SectionType } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import { ISection } from '../../domain/interfaces/Section';
import { Media } from '../../domain/models/Media';

interface ILandingAPI {
  fetchMedia(sectionType: SectionType): Promise<Media[]>;
  fetchSection(sectionType: SectionType): Promise<ISection>;
}

class LandingAPI implements ILandingAPI {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  fetchMedia(sectionType: SectionType): Promise<Media[]> {
    return this.httpClient.get<Media[]>(`/api/banner/media?sectionType=${sectionType}`);
  }

  fetchSection(sectionType: SectionType): Promise<ISection> {
    return this.httpClient.get<ISection>(`/api/banner/section?sectionType=${sectionType}`);
  }
}

// Apply decorators programmatically
decorate(injectable(), LandingAPI);

// Create a factory function
export const createLandingAPI = (httpClient: IHttpClient): ILandingAPI => {
  return new LandingAPI(httpClient);
};

export { LandingAPI };
export type { ILandingAPI };
