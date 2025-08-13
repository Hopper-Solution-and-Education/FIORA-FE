import { EmailTemplate, Prisma } from '@prisma/client';

export interface IEmailTemplateRepository {
  createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate>;
  getEmailTemplate(): Promise<EmailTemplate[]>;
  updateEmailTemplate(
    id: string,
    userId: string,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate>;
  findEmailTemplateById(id: string): Promise<EmailTemplate | null>;
}
