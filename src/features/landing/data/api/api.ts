import type { IHttpClient } from '@/config/HttpClient';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/landingDIContainer.type';
import { ISection } from '../../domain/interfaces/Section';
import { Media } from '../../domain/models/Media';

interface ILandingAPI {
  fetchMedia(sectionType: SectionType): Promise<Media[]>;
  fetchSection(sectionType: SectionType): Promise<ISection>;
}

@injectable()
class LandingAPI implements ILandingAPI {
  private httpClient: IHttpClient;

  constructor(@inject(TYPES.IHttpClient) httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  fetchMedia(sectionType: SectionType): Promise<Media[]> {
    return this.httpClient.get<Media[]>(`/api/banner/media?sectionType=${sectionType}`);
  }

  fetchSection(sectionType: SectionType): Promise<ISection> {
    return this.httpClient.get<ISection>(`/api/banner/section?sectionType=${sectionType}`);
  }
}

export { LandingAPI };
export type { ILandingAPI };
