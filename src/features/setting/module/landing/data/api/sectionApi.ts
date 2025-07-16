import type { IHttpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { ISection } from '../../slices/types';

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

export { createSectionAPI, SectionAPI };
export type { ISectionAPI };
