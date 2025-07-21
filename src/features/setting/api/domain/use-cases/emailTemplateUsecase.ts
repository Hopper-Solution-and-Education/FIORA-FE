import { EmailTemplate, Prisma } from '@prisma/client';
import { emailTemplateRepository } from '../../infrastructure/repositories/emailTemplateRepository';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateUseCase implements IEmailTemplateRepository {
  private emailTemplateRepository: IEmailTemplateRepository;

  constructor(emailTemplateRepository: IEmailTemplateRepository) {
    this.emailTemplateRepository = emailTemplateRepository;
  }
  async getEmailTemplate(): Promise<EmailTemplate[]> {
    return await this.emailTemplateRepository.getEmailTemplate();
  }
  async createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return await this.emailTemplateRepository.createEmailTemplate(data);
  }
}

export const emailTemplateUseCase = new EmailTemplateUseCase(emailTemplateRepository);
