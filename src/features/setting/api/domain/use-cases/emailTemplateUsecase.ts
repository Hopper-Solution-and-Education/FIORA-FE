import { Messages } from '@/shared/constants/message';
import { EmailTemplate, Prisma } from '@prisma/client';
import { emailTemplateRepository } from '../../infrastructure/repositories/emailTemplateRepository';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateUseCase implements IEmailTemplateRepository {
  private emailTemplateRepository: IEmailTemplateRepository;

  constructor(emailTemplateRepository: IEmailTemplateRepository) {
    this.emailTemplateRepository = emailTemplateRepository;
  }
  async findEmailTemplateById(id: string): Promise<EmailTemplate | null> {
    return await this.emailTemplateRepository.findEmailTemplateById(id);
  }
  async getEmailTemplate(): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.getEmailTemplate();
  }
  async createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return await this.emailTemplateRepository.createEmailTemplate(data);
  }
  async updateEmailTemplate(
    id: string,
    userId: string,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    const emailTemplate = await this.emailTemplateRepository.findEmailTemplateById(id);
    if (!emailTemplate) {
      throw new Error(Messages.EMAIL_TEMPLATE_NOT_FOUND);
    }
    return await this.emailTemplateRepository.updateEmailTemplate(id, userId, {
      ...data,
      updatedBy: userId,
    });
  }
}

export const emailTemplateUseCase = new EmailTemplateUseCase(emailTemplateRepository);
