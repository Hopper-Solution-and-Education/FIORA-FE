import { EmailTemplate, EmailTemplateType, Prisma, emailType } from '@prisma/client';

export interface IEmailTemplateRepository {
  createEmailTemplate(
    data: Prisma.EmailTemplateCreateInput,
    type: emailType,
  ): Promise<EmailTemplateType>;
  getEmailTemplate(): Promise<EmailTemplate[]>;
  updateEmailTemplate(
    id: string,
    userId: string,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate>;
  findEmailTemplateById(id: string): Promise<EmailTemplate | null>;
}
