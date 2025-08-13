import { prisma } from '@/config';
import { EmailTemplate, EmailTemplateType, Prisma } from '@prisma/client';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateRepository implements IEmailTemplateRepository {
  async createEmailTemplate(data: Prisma.EmailTemplateCreateInput): Promise<EmailTemplate> {
    return await prisma.emailTemplate.create({
      data: { ...data },
      include: {
        EmailTemplateType: true,
      },
    });
  }
  async getEmailTemplate(): Promise<any[]> {
    return await prisma.emailTemplate.findMany({
      include: {
        EmailTemplateType: true,
      },
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
    const updatedCategory = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: data.name,
        content: data.content,
        updatedBy: userId,
      },
      include: {
        EmailTemplateType: true,
      },
    });

    return updatedCategory;
  }

  async findEmailTemplateById(id: string): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.findUnique({
      where: { id },
      include: {
        EmailTemplateType: true,
      },
    });
  }

  async delete(id: string): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.delete({ where: { id } });
  }

  async findEmailTemplateByTypeOrName(
    emailTemplateType: string,
    name: string,
  ): Promise<EmailTemplate | null> {
    const result = await prisma.emailTemplate.findFirst({
      where: {
        AND: [{ emailtemplatetypeid: emailTemplateType }, { name }],
      },
      include: {
        EmailTemplateType: true,
      },
    });

    return result || null;
  }

  async checkTemplateDefault(): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.findFirst({
      where: { isActive: true },
    });
  }

  async checkTemplateType(id: string): Promise<EmailTemplateType | null> {
    return await prisma.emailTemplateType.findUnique({
      where: { id },
    });
  }

  async getEmailTemplateType(): Promise<any[]> {
    return await prisma.emailTemplateType.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

export const emailTemplateRepository = new EmailTemplateRepository();
