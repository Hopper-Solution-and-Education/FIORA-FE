import { MediaType, SectionType } from '@prisma/client';
import prisma from '@/infrastructure/database/prisma';
import { IMediaRepository } from '../../domain/interfaces/MediaRepository';
import { Media } from '../../domain/models/Media';

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
    const result = await prisma.media.findMany({
      where: { section: { section_type: sectionType }, media_type: MediaType.IMAGE },
      select: {
        id: true,
        media_type: true,
        media_url: true,
        embed_code: true,
        description: true,
        uploaded_by: true,
        uploaded_date: true,
        section_id: true,
      },
    });

    return result.map((item) => ({
      ...item,
      section_type: sectionType,
    }));
  }
}
