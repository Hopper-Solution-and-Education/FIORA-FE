export interface Media {
  id: number;
  media_url: string | null;
  description: string | null;
  uploaded_by: string | null;
  uploaded_date: Date;
  section_type: string;
}
