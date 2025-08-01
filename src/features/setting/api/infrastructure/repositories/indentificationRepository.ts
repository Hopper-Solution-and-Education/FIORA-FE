import { prisma } from '@/config';
import { IdentificationDocument, Prisma } from '@prisma/client';

class IdentificationRepository {
  async create(data: Prisma.IdentificationDocumentCreateInput): Promise<any> {
    try {
      return await prisma.identificationDocument.create({ data: { ...data } });
    } catch (error) {
      console.log(error);
    }
  }
  async get(): Promise<IdentificationDocument[]> {
    return await prisma.identificationDocument.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: string) {
    return await prisma.identificationDocument.findFirst({
      where: {
        id,
      },
    });
  }
}

export const identificationRepository = new IdentificationRepository();
