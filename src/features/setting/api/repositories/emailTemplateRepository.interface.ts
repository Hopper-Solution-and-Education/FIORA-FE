import { EmailTemplate, Prisma } from '@prisma/client';

export interface IEmailTemplateRepository {
  createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate>;
  getEmailTemplate(): Promise<EmailTemplate[]>;
}
