import { TYPES } from '@/infrastructure/di/type';
import type { IHttpClient } from '@/lib/HttpClient';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ISection } from '../../slices/types';

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
    console.log('====================================');
    console.log(reponse);
    console.log('====================================');
    return reponse;
  }
}
export { SectionAPI };
export type { ISectionAPI };
