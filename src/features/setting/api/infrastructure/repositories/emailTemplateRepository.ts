import { prisma } from '@/config';
import { EmailTemplate, Prisma } from '@prisma/client';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateRepository implements IEmailTemplateRepository {
  async createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return await prisma.emailTemplate.create({ data: { ...data } });
  }
  async getEmailTemplate(): Promise<EmailTemplate[]> {
    return await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

// Export a single instance
export const emailTemplateRepository = new EmailTemplateRepository();
