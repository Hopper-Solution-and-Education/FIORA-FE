import { prisma } from '@/config';
import { ContactUsRequest } from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqRepository } from '@/features/helps-center/domain/repositories';
import { faqRepository } from '../../../infrastructure/repositories';
import { sendContactUsEmail } from '../../../infrastructure/services/contactUsEmailService';

export class ContactUsUseCase {
  constructor(private faqsRepository: IFaqRepository) {}

  async execute(params: ContactUsRequest) {
    try {
      // get all admin user
      const adminUsers = await prisma.user.findMany({
        where: {
          role: 'Admin',
        },
      });

      if (adminUsers.length === 0) {
        throw new Error('No admin user found');
      }

      // send email to all admin users
      for (const adminUser of adminUsers) {
        await sendContactUsEmail({
          to: adminUser.email,
          adminName: adminUser.name || 'Admin',
          name: params.name,
          email: params.email,
          phone: params.phoneNumber,
          message: params.message,
          attachments: params.attachments,
        });
      }

      return {
        message: 'Contact us request sent to all admin users',
      };
    } catch (error) {
      console.error(error);
    }
  }
}

export const createFaqUseCase = new ContactUsUseCase(faqRepository);
