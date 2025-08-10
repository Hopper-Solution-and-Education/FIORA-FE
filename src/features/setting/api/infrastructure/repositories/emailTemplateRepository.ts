import { prisma } from '@/config';
import { BadRequestError } from '@/shared/lib';
import { EmailTemplate, EmailTemplateType, Prisma, emailType } from '@prisma/client';
import { IEmailTemplateRepository } from '../../repositories/emailTemplateRepository.interface';

class EmailTemplateRepository implements IEmailTemplateRepository {
  async createEmailTemplate(
    data: Prisma.EmailTemplateCreateInput,
    type: emailType,
  ): Promise<EmailTemplateType> {
    return prisma.$transaction(async (tx) => {
      const newEmailTemplateType: Prisma.EmailTemplateTypeCreateInput = {
        createdAt: new Date(),
        createdBy: data.createdBy,
        updatedAt: new Date(),
        updatedBy: null,
        EmailTemplate: { connect: { id: String(data.id) } },
        id: crypto.randomUUID(),
        type: type,
      };
      await tx.emailTemplate.create({ data: { ...data } });

      return await tx.emailTemplateType.create({
        data: { ...newEmailTemplateType },
        include: {
          EmailTemplate: true,
        },
      });
    });
  }
  async getEmailTemplate(): Promise<any[]> {
    return await prisma.emailTemplateType.findMany({
      include: {
        EmailTemplate: true,
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
    const emailTemplate = await prisma.emailTemplate.findUnique({
      where: { id },
      select: { EmailTemplateType: true, isActive: true },
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

  async findEmailTemplateByTypeOrName(
    type: emailType,
    name: string,
  ): Promise<EmailTemplate | null> {
    const result = await prisma.emailTemplateType.findFirst({
      where: {
        AND: [{ type }, { EmailTemplate: { name } }],
        EmailTemplate: {
          isActive: true,
        },
      },
      include: {
        EmailTemplate: true,
      },
    });

    return result?.EmailTemplate || null;
  }

  async checkTemplateDefault(): Promise<EmailTemplate | null> {
    return await prisma.emailTemplate.findFirst({
      where: { isActive: true },
    });
  }
}

export const emailTemplateRepository = new EmailTemplateRepository();
