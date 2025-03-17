import { SectionType } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../di/landingDIContainer.type';
import { Media } from '../../domain/models/Media';
import type { ILandingAPI } from '../api/api';

export interface IMediaRepository {
  getMediaBySection(sectionType: SectionType): Promise<Media[]>;
}

@injectable()
export class MediaRepository implements IMediaRepository {
  private landingAPI: ILandingAPI;

  constructor(@inject(TYPES.ILandingAPI) landingAPI: ILandingAPI) {
    this.landingAPI = landingAPI;
  }

  getMediaBySection(sectionType: SectionType): Promise<Media[]> {
    return this.landingAPI.fetchMedia(sectionType);
  }
}
