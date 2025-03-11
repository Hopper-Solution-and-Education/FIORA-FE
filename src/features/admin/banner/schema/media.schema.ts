import type { MediaType, SectionType } from '@prisma/client';

export interface Media {
  id: number;
  media_type: MediaType;
  media_url?: string;
  embed_code?: string;
  description?: string;
  uploaded_by?: string;
  uploaded_date: Date;
}

export interface Section {
  section_id: number;
  section_type: SectionType;
  name: string;
  order: number;
  created_at: Date;
  updated_at: Date;
  medias: Media[];
}
