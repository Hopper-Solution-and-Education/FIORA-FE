import { Prisma, Attachment } from '@prisma/client';

export interface IAttachmentRepository {
  createAttachment(data: Prisma.AttachmentUncheckedCreateInput): Promise<Attachment>;
  findAttachmentById(id: string): Promise<Attachment | null>;
  findManyAttachments(where: Prisma.AttachmentWhereInput): Promise<Attachment[]>;
  updateAttachment(
    where: Prisma.AttachmentWhereUniqueInput,
    data: Prisma.AttachmentUpdateInput,
  ): Promise<Attachment>;
  deleteAttachment(where: Prisma.AttachmentWhereUniqueInput): Promise<Attachment>;
  aggregate(options: Prisma.AttachmentAggregateArgs): Promise<any>;
  count(options: Prisma.AttachmentCountArgs): Promise<number>;
}
