import { TYPES } from '@/infrastructure/di/type';
import type { IHttpClient } from '@/lib/HttpClient';
import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ISection } from '../../slices/types';

interface ISectionAPI {
  fetchSection(sectionType: SectionType): Promise<ISection>;
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
}
export { SectionAPI };
export type { ISectionAPI };
