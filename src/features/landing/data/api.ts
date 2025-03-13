import { SectionType } from '@prisma/client';
import { httpClient } from '@/config/HttpClient';
import { Media } from '../domain/models/Media';

export const fetchMedia = async (sectionType: SectionType) => {
  return await httpClient.get<Media[]>(`/api/banner/media?sectionType=${sectionType}`);
};
