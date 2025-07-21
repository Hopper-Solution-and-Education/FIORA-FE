import { MediaType } from '@prisma/client';

export interface Media {
  id: number;
  media_type: MediaType;
  media_url?: string;
  media_url_2?: string;
  embed_code?: string;
  description?: string;
  uploaded_by?: string;
  uploaded_date: Date;
}
