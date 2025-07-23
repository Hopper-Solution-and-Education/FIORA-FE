import { ChannelType } from '../enum';

export type Notification = {
  id: string;
  notifyTo: string;
  emails: string[];
  emailTemplateId?: string;
  attachmentId?: string;
  title: string;
  message: string;
  type: string;
  deepLink?: string;
  channel: ChannelType;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  emailTemplate?: {
    id: string;
    name: string;
    content: string;
    isActive: boolean;
  };
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
};
