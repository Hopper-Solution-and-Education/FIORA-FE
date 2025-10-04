export interface NotificationFilterOptions {
  sender: string[];
  recipient: string[];
  notifyType: string[];
}

export interface Notification {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  emailtemplatetypeid: string;
  isdefault: boolean;
  EmailTemplateType: EmailTemplateType;
}

export interface EmailTemplateType {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  id: string;
  type: string;
}
