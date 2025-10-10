import { prisma } from '@/config';
import { EmailTemplate, EmailTemplateField, EmailTemplateType, Prisma } from '@prisma/client';
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
    const emailTemplates = await prisma.emailTemplate.findMany({
      include: {
        EmailTemplateType: {
          select: { id: true, type: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const emailTemplateFields = await prisma.emailTemplateField.findMany({
      orderBy: { type: 'asc' },
      select: { type: true, id: true, name: true },
    });
    const result = emailTemplates.map((template) => {
      const matchedFields = emailTemplateFields.filter(
        (field) => field.type === template.EmailTemplateType.type,
      );

      return {
        ...template,
        fieldRequire: matchedFields,
      };
    });
    return result;
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

  async getEmailTemplateField() {
    const result = await prisma.emailTemplateField.findMany({
      orderBy: { type: 'asc' },
      select: { type: true, id: true, name: true, createdAt: true, updatedAt: true },
    });

    const grouped: Record<string, any[]> = {};
    for (const item of result) {
      (grouped[item.type] ??= []).push(item);
    }
    return grouped;
  }

  // EmailTemplateField CRUD
  async createEmailTemplateField(
    data: Pick<EmailTemplateField, 'name' | 'type'> & {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      createdBy?: string | null;
      updatedBy?: string | null;
    },
  ): Promise<EmailTemplateField> {
    return await prisma.emailTemplateField.create({
      data: {
        id: data.id,
        name: data.name,
        type: data.type,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy ?? null,
        updatedBy: data.updatedBy ?? null,
      },
    });
  }

  async updateEmailTemplateField(
    id: string,
    data: Partial<Pick<EmailTemplateField, 'name' | 'type'>> & {
      updatedBy?: string | null;
      updatedAt?: Date;
    },
  ): Promise<EmailTemplateField> {
    return await prisma.emailTemplateField.update({
      where: { id },
      data: {
        name: data.name,
        type: data.type,
        updatedBy: data.updatedBy ?? undefined,
        updatedAt: data.updatedAt ?? new Date(),
      },
    });
  }

  async deleteEmailTemplateField(id: string): Promise<EmailTemplateField> {
    return await prisma.emailTemplateField.delete({ where: { id } });
  }

  async findEmailTemplateFieldById(id: string): Promise<EmailTemplateField | null> {
    return await prisma.emailTemplateField.findUnique({ where: { id } });
  }

  async findEmailTemplateFieldByTypeAndName(
    type: EmailTemplateField['type'],
    name: string,
  ): Promise<EmailTemplateField | null> {
    return await prisma.emailTemplateField.findFirst({ where: { type, name } });
  }
}

export const emailTemplateRepository = new EmailTemplateRepository();
