import { prisma } from '@/config';
import { notificationRepository } from '@/features/notification/infrastructure/repositories/notificationRepository';
import { SessionUser } from '@/shared/types/session';
import {
  IdentificationDocument,
  IdentificationType,
  KYCMethod,
  KYCStatus,
  KYCType,
  NotificationType,
  Prisma,
} from '@prisma/client';

class IdentificationRepository {
  async create(data: Prisma.IdentificationDocumentCreateInput, user: SessionUser): Promise<any> {
    try {
      return prisma.$transaction(async (tx) => {
        let type;
        let fieldName = '';
        if (data.type == IdentificationType.TAX) {
          type = KYCType.TAX;
          fieldName = 'tax';
        } else {
          type = KYCType.IDENTIFICATION;
          fieldName = 'identification';
        }

        const identification = await tx.identificationDocument.create({
          data: { ...data, createdBy: user.id },
        });
        await tx.eKYC.create({
          data: {
            type: type,
            fieldName: fieldName,
            status: KYCStatus.PENDING,
            createdBy: user.id.toString(),
            userId: user.id.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            id: crypto.randomUUID(),
            refId: identification.id,
            method: KYCMethod.MANUAL,
          },
        });

        await notificationRepository.createBoxNotification({
          title: `Verify new ${fieldName} !`,
          type: type,
          notifyTo: NotificationType.ADMIN_CS,
          attachmentId: '',
          deepLink: '',
          message: `User ${user.email} has submitted a new verify ${fieldName}.`,
          emails: [user.email],
        });
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

  async checkIdentification(type: IdentificationType, idNumber: string, userId: string) {
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

  async getByType(userId: string, type: IdentificationType) {
    return await prisma.identificationDocument.findFirst({
      where: {
        userId,
        type,
      },
    });
  }

  async getByUserId(id: string) {
    return await prisma.identificationDocument.findMany({
      where: {
        userId: id,
      },
      include: {
        fileBack: true,
        fileFront: true,
        fileLocation: true,
        filePhoto: true,
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
        const user = await tx.user.findFirst({
          where: { id: identification.userId },
          select: { id: true, kyc_levels: true, email: true },
        });

        const levelOrder = identification.type === IdentificationType.TAX ? '2' : '1';

        const updatedKycLevels = user?.kyc_levels || [];
        if (!updatedKycLevels.includes(levelOrder)) {
          updatedKycLevels.push(levelOrder);
        }

        await tx.user.update({
          where: { id: user?.id },
          data: {
            kyc_levels: updatedKycLevels,
            updatedAt: new Date(),
            updatedBy: userId,
          },
        });
        await tx.eKYC.update({
          where: { id: kycId, refId: identificationId },
          data: { updatedAt: new Date(), updatedBy: userId, status: status, verifiedBy: userId },
        });
        // let type;
        // let fieldName = '';
        // if (identification.type == IdentificationType.TAX) {
        //   type = KYCType.TAX;
        //   fieldName = 'tax';
        // } else {
        //   type = KYCType.IDENTIFICATION;
        //   fieldName = 'identification';
        // }

        // if (status == KYCStatus.APPROVAL || status == KYCStatus.REJECTED) {
        //   const title =
        //     status == KYCStatus.REJECTED
        //       ? `Reject request verify ${fieldName}!`
        //       : `Approve ${fieldName} verification request!`;
        //   const message =
        //     status == KYCStatus.REJECTED
        //       ? `Your request to verify your ${identification.type.toLowerCase()} has been rejected!`
        //       : `Your ${identification.type.toLowerCase()} verification request has been approved!`;

        //   await notificationRepository.createBoxNotification({
        //     title,
        //     type,
        //     notifyTo: NotificationType.PERSONAL,
        //     attachmentId: '',
        //     deepLink: '',
        //     message,
        //     emails: user?.email ? [user?.email] : [],
        //   });
        // }
        return identification;
      });
    } catch (error) {
      console.log(error);
      return error as unknown;
    }
  }

  async update(id: string, ekycId: string, userId: string, data: any) {
    try {
      return prisma.$transaction(async (tx) => {
        const updatedIdentification = await tx.identificationDocument.update({
          where: { id },
          data: {
            ...data,
            updatedBy: userId,
          },
        });

        // Update related eKYC status to pending
        await tx.eKYC.update({
          where: { id: ekycId },
          data: { status: KYCStatus.PENDING, updatedBy: userId, updatedAt: new Date() },
        });

        return updatedIdentification;
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

        const user = await tx.user.findFirst({
          where: { id: identification.userId },
          select: { id: true, kyc_levels: true },
        });
        const kycKey = identification.type === IdentificationType.TAX ? '2' : '1';

        let updatedKycLevels = user?.kyc_levels || [];

        if (updatedKycLevels.includes(kycKey)) {
          updatedKycLevels = updatedKycLevels.filter((key) => key !== kycKey);
        }

        await tx.user.update({
          where: { id: user?.id },
          data: {
            kyc_levels: updatedKycLevels,
            updatedAt: new Date(),
            updatedBy: identification.userId,
          },
        });
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
