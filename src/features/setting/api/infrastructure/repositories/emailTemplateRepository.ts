import { prisma } from '@/config';
import { BadRequestError } from '@/shared/lib';
import { EmailTemplate, Prisma } from '@prisma/client';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateRepository implements IEmailTemplateRepository {
  async createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return await prisma.emailTemplate.create({ data: { ...data } });
  }
  async getEmailTemplate(): Promise<EmailTemplate[]> {
    return await prisma.emailTemplate.findMany({
      where: { isActive: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateEmailTemplate(
    id: string,
    userId: string,
    data: Partial<EmailTemplate>,
  ): Promise<EmailTemplate> {
    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: { id },
      select: { type: true, isActive: true },
    });

    if (!emailTemplate || emailTemplate.isActive == false) {
      throw new BadRequestError('Email template not found!');
    }
    data.updatedBy = userId;
    const updatedCategory = await prisma.emailTemplate.update({
      where: { id },
      data,
    });

    return updatedCategory;
  }

  async findEmailTemplateById(id: string): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.delete({ where: { id } });
  }
}

export const emailTemplateRepository = new EmailTemplateRepository();
