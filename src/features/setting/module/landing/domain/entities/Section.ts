import { Media, SectionType } from '@prisma/client';

export interface Section {
  section_id: number;
  section_type: SectionType;
  name: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  medias: Media[];
}
