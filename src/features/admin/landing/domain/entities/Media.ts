import { MediaType } from '@prisma/client';

export interface Media {
  id: number;
  media_type: MediaType;
  media_url?: string;
  embed_code?: string;
  description?: string;
  uploaded_by?: string;
  uploaded_date: Date;
}
