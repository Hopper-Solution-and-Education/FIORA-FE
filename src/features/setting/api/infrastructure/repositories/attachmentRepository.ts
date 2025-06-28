import { Prisma, Attachment } from '@prisma/client';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';
import { prisma } from '@/config';

class AttachmentRepository implements IAttachmentRepository {
  private _prisma: Prisma.TransactionClient | typeof prisma;

  constructor(prismaClient?: Prisma.TransactionClient) {
    this._prisma = prismaClient || prisma;
  }

  async createAttachment(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment> {
    return this._prisma.attachment.create({ data });
  }

  async findAttachmentById(id: string): Promise<Attachment | null> {
    return this._prisma.attachment.findUnique({
      where: { id },
    });
  }

  async findManyAttachments(where: Prisma.AttachmentWhereInput): Promise<Attachment[]> {
    return this._prisma.attachment.findMany({ where });
  }

  async updateAttachment(
    where: Prisma.AttachmentWhereUniqueInput,
    data: Prisma.AttachmentUpdateInput,
  ): Promise<Attachment> {
    return this._prisma.attachment.update({ where, data });
  }

  async deleteAttachment(where: Prisma.AttachmentWhereUniqueInput): Promise<Attachment> {
    return this._prisma.attachment.delete({ where });
  }

  async aggregate(options: Prisma.AttachmentAggregateArgs): Promise<any> {
    return this._prisma.attachment.aggregate(options);
  }

  async count(options: Prisma.AttachmentCountArgs): Promise<number> {
    return this._prisma.attachment.count(options);
  }
}

export const attachmentRepository = new AttachmentRepository();
