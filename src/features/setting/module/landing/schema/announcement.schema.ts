import * as yup from 'yup';

export const announcementItemSchema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  isActive: yup.boolean().default(true),
  id: yup.string().optional(), // Cho phép update nếu có id
});

export const announcementListFormSchema = yup.object({
  announcements: yup
    .array()
    .of(announcementItemSchema)
    .min(1, 'At least one announcement required'),
});

export type AnnouncementItem = yup.InferType<typeof announcementItemSchema>;
export type AnnouncementListForm = yup.InferType<typeof announcementListFormSchema>;

export const announcementListDefaultValues = (): AnnouncementListForm => ({
  announcements: [
    {
      title: '',
      content: '',
      isActive: true,
    },
  ],
});
