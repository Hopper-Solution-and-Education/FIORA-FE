import type { IHttpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { SectionTypeEnum } from '../../constants';
import { ISection } from '../../domain/interfaces/Section';

interface BannerResponse {
  data: ISection;
  message: string;
}

interface ILandingAPI {
  fetchSection(sectionType: SectionTypeEnum): Promise<ISection>;
}

class LandingAPI implements ILandingAPI {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async fetchSection(sectionType: SectionTypeEnum): Promise<ISection> {
    const response = await this.httpClient.get<BannerResponse>(
      `/api/banners/sections?sectionType=${sectionType}`,
    );
    return response.data;
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
