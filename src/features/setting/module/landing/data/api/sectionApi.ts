import { ApiClient } from '@/config/http-client';
import { SectionTypeEnum } from '@/features/landing/constants';
import { decorate, injectable } from 'inversify';
import { ISection } from '../../slices/types';
import { routeConfig } from '@/shared/utils/route';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { BaseResponse } from '@/shared/types';

interface ISectionAPI {
  fetchSection(sectionType: SectionTypeEnum): Promise<BaseResponse<ISection>>;
  updateSection(section: ISection): Promise<BaseResponse<ISection>>;
}

// Define the class without decorators
class SectionAPI implements ISectionAPI {
  private httpClient: ApiClient;

  constructor(httpClient: ApiClient) {
    this.httpClient = httpClient;
  }

  async fetchSection(sectionType: SectionTypeEnum): Promise<BaseResponse<ISection>> {
    const url = routeConfig(ApiEndpointEnum.BannerSection, undefined, { sectionType });
    return await this.httpClient.get<ISection>(url);
  }

  async updateSection(section: ISection): Promise<BaseResponse<ISection>> {
    return await this.httpClient.put<ISection>(ApiEndpointEnum.BannerSection, section);
  }
}

// Apply decorators programmatically
decorate(injectable(), SectionAPI);

// Create a factory function that handles the injection
const createSectionAPI = (httpClient: ApiClient): ISectionAPI => {
  return new SectionAPI(httpClient);
};

export { createSectionAPI, SectionAPI };
export type { ISectionAPI };
