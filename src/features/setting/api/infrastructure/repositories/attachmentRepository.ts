import { prisma } from '@/config';
import { Attachment, Prisma } from '@prisma/client';
import { IAttachmentRepository } from '../../repositories/attachmentRepository.interface';

class AttachmentRepository implements IAttachmentRepository {
  private _prisma: Prisma.TransactionClient | typeof prisma;

  constructor(prismaClient?: Prisma.TransactionClient) {
    this._prisma = prismaClient || prisma;
  }

  async createAttachment(data: any): Promise<Attachment> {
    const shortenString = (str: string, maxLength: number) =>
      str && str.length > maxLength ? str.slice(0, maxLength) : str;

    const safeData = {
      ...data,
      url: shortenString(data.url, 255),
      path: shortenString(data.path, 255),
      type: shortenString(data.type, 50),
    };
    return this._prisma.attachment.create({ data: safeData });
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
