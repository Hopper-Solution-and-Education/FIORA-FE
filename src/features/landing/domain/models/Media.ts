export interface Media {
  id: string;
  media_url: string | null;
  media_url_2: string | null;
  media_order: number;
  media_type: string;
  redirect_url: string | null;
  embed_code: string | null;
  description: string | null;
  uploaded_by: string | null;
  uploaded_date: Date;
  section_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  mediaReviewUser: {
    media_user_name: string;
    media_user_title: string;
    media_user_avatar: string;
    media_user_comment: string;
    media_user_rating: number;
    media_user_email: string;
    createdBy: string;
    updatedBy: string;
  } | null;
}
