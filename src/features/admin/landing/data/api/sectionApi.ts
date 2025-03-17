import { TYPES } from '@/infrastructure/di/type';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ISection } from '../../slices/types';
import type { IHttpClient } from '@/config/HttpClient';

interface ISectionAPI {
  fetchSection(sectionType: SectionType): Promise<ISection>;
  updateSection(section: ISection): Promise<ISection>;
}

@injectable()
class SectionAPI implements ISectionAPI {
  private httpClient: IHttpClient;

  constructor(@inject(TYPES.IHttpClient) httpClient: IHttpClient) {
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
export { SectionAPI };
export type { ISectionAPI };
