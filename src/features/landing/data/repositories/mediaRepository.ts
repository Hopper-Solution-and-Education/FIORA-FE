import { SectionType } from '@prisma/client';
import { decorate, injectable } from 'inversify';
import { Media } from '../../domain/models/Media';
import type { ILandingAPI } from '../api/api';

export interface IMediaRepository {
  getMediaBySection(sectionType: SectionType): Promise<Media[]>;
}

export class MediaRepository implements IMediaRepository {
  private landingAPI: ILandingAPI;

  constructor(landingAPI: ILandingAPI) {
    this.landingAPI = landingAPI;
  }

  getMediaBySection(sectionType: SectionType): Promise<Media[]> {
    return this.landingAPI.fetchMedia(sectionType);
  }
}

// Apply decorators programmatically
decorate(injectable(), MediaRepository);

// Create a factory function
export const createMediaRepository = (landingAPI: ILandingAPI): IMediaRepository => {
  return new MediaRepository(landingAPI);
};
