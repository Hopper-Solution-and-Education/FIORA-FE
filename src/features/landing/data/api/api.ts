import { decorate, injectable } from 'inversify';
import { SectionTypeEnum } from '../../constants';
import { ISection } from '@/features/setting/module/landing/slices/types';
import { ApiClient } from '@/config/http-client';
import { routeConfig } from '@/shared/utils/route';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { BaseResponse } from '@/shared/types';

interface ILandingAPI {
  fetchSection(sectionType: SectionTypeEnum): Promise<BaseResponse<ISection>>;
}

class LandingAPI implements ILandingAPI {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async fetchSection(sectionType: SectionTypeEnum): Promise<BaseResponse<ISection>> {
    const url = routeConfig(ApiEndpointEnum.BannerSections, undefined, { sectionType });
    return await this.apiClient.get<ISection>(url);
  }
}

// Apply decorators programmatically
decorate(injectable(), LandingAPI);

// Create a factory function
export const createLandingAPI = (apiClient: ApiClient): ILandingAPI => {
  return new LandingAPI(apiClient);
};

export { LandingAPI };
export type { ILandingAPI };
