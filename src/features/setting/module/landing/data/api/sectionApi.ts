import { SectionType } from '@prisma/client';
import { injectable, decorate } from 'inversify';
import { ISection } from '../../slices/types';
import type { IHttpClient } from '@/config/http-client/HttpClient';

interface ISectionAPI {
  fetchSection(sectionType: SectionType): Promise<ISection>;
  updateSection(section: ISection): Promise<ISection>;
}

// Define the class without decorators
class SectionAPI implements ISectionAPI {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async fetchSection(sectionType: SectionType): Promise<ISection> {
    return await this.httpClient.get<ISection>(`/api/banner/section?sectionType=${sectionType}`);
  }

  async updateSection(section: ISection): Promise<ISection> {
    const reponse = await this.httpClient.put<ISection>(`/api/banner/section`, section);
    return reponse;
  }
}

// Apply decorators programmatically
decorate(injectable(), SectionAPI);

// Create a factory function that handles the injection
const createSectionAPI = (httpClient: IHttpClient): ISectionAPI => {
  return new SectionAPI(httpClient);
};

export { SectionAPI, createSectionAPI };
export type { ISectionAPI };
