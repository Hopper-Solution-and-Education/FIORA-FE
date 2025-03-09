import { SectionType } from '@prisma/client';

import { IMediaRepository } from '../../domain/interfaces/MediaRepository';
import { Media } from '../../domain/models/Media';
import { fetchMedia } from '../api';

export class MediaRepository implements IMediaRepository {
  private static instance: MediaRepository;

  private constructor() {}

  public static getInstance(): MediaRepository {
    if (!MediaRepository.instance) {
      MediaRepository.instance = new MediaRepository();
    }
    return MediaRepository.instance;
  }

  async getMediaBySection(sectionType: SectionType): Promise<Media[]> {
    return await fetchMedia(sectionType);
  }
}
