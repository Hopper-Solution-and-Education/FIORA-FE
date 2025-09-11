import { prisma } from '@/config';
import { ContactUsRequest } from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqRepository } from '@/features/helps-center/domain/repositories';
import { sendContactUsEmail } from '@/features/helps-center/infrastructure/services/contactUsEmailService';
import { faqRepository } from '../../../infrastructure/repositories';

export class ContactUsUseCase {
  constructor(private faqsRepository: IFaqRepository) {}

  async execute(params: ContactUsRequest) {
    try {
      // get all admin users
      const adminUsers = await prisma.user.findMany({ where: { role: 'Admin' } });
      if (adminUsers.length === 0) throw new Error('No admin user found');

      // Send email to all admin users
      for (const adminUser of adminUsers) {
        await sendContactUsEmail({
          to: adminUser.email,
          adminName: adminUser.name || 'Admin',
          name: params.name,
          email: params.email,
          phone: params.phoneNumber,
          message: params.message,
          attachments: Array.isArray(params.attachments)
            ? (params.attachments.filter(
                (a: any) => a && typeof (a as any).arrayBuffer === 'function',
              ) as unknown as File[])
            : undefined,
        });
      }

      return { message: 'Contact us request sent success' };
    } catch (error) {
      console.error(error);
    }
  }
}

export const contactUsUseCase = new ContactUsUseCase(faqRepository);
