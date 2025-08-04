import { prisma } from '@/config';
import { IdentificationDocument, KYCStatus, Prisma } from '@prisma/client';

class IdentificationRepository {
  async create(
    data: Prisma.IdentificationDocumentCreateInput,
    kycId: string,
    userid: string,
  ): Promise<any> {
    try {
      return prisma.$transaction(async (tx) => {
        const identification = await tx.identificationDocument.create({
          data: { ...data, createdBy: userid },
        });

        await tx.eKYC.update({ where: { id: kycId }, data: { refId: identification?.id || null } });

        return identification;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }

  async get(): Promise<IdentificationDocument[]> {
    return await prisma.identificationDocument.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkIdentification(data: Prisma.IdentificationDocumentCreateInput, userId: string) {
    const { type, idNumber } = data;
    return await prisma.identificationDocument.findFirst({
      where: {
        type,
        userId,
        idNumber,
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

  async getByUserId(id: string) {
    return await prisma.identificationDocument.findFirst({
      where: {
        userId: id,
      },
    });
  }

  async verify(
    data: {
      kycId: string;
      remarks: string;
      status: KYCStatus;
    },
    identificationId: string,
    userId: string,
  ): Promise<any> {
    try {
      const { kycId, remarks, status } = data;
      return prisma.$transaction(async (tx) => {
        const identification = await tx.identificationDocument.update({
          where: { id: identificationId },
          data: {
            remarks: remarks || '',
            status: status,
            updatedAt: new Date(),
            updatedBy: userId,
          },
        });

        await tx.eKYC.update({
          where: { id: kycId, refId: identificationId },
          data: { updatedAt: new Date(), updatedBy: userId, status: status, verifiedBy: userId },
        });

        return identification;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }

  async delete(id: string) {
    try {
      return prisma.$transaction(async (tx) => {
        const identification = await tx.identificationDocument.delete({ where: { id } });

        const eKycRecord = await tx.eKYC.findFirst({ where: { refId: id } });
        if (eKycRecord) {
          await tx.eKYC.delete({ where: { id: eKycRecord.id } });
        }

        return identification;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }
}

export const identificationRepository = new IdentificationRepository();
