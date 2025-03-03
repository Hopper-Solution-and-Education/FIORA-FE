import { SectionType } from '@prisma/client';
import { Media } from '../models/Media';

export interface IMediaRepository {
  getMediaBySection(sectionType: SectionType): Promise<Media[]>;
}
