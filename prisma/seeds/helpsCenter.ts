import { PostType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedHelpsCenter() {
  await prisma.postCategory.createMany({
    data: [
      {
        id: '9c32b78d-3f1b-467f-977d-0961e4e9fb7f',
        name: 'User Tutorial',
        description: 'User Tutorial',
        type: PostType.TUTORIAL,
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
      },
      {
        id: 'ba530464-92ca-48cc-8c33-cbbf4f8649dd',
        name: 'About Us',
        description: 'About Us',
        type: PostType.ABOUT,
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
      },
      {
        id: '16ae4e36-952e-47ae-b7c4-3a88f4ff444e',
        name: 'Terms and Conditions',
        description: 'Terms and Conditions',
        type: PostType.TNC,
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
      },
    ],
  });

  await prisma.post.createMany({
    data: [
      {
        title: 'User Tutorial',
        content: 'User Tutorial',
        type: PostType.TUTORIAL,
        userId: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        categoryId: '9c32b78d-3f1b-467f-977d-0961e4e9fb7f',
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
      },
      {
        title: 'About Us',
        content: 'About Us',
        type: PostType.ABOUT,
        userId: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        categoryId: 'ba530464-92ca-48cc-8c33-cbbf4f8649dd',
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
      },
      {
        title: 'Terms and Conditions',
        content: 'Terms and Conditions',
        type: PostType.TNC,
        userId: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        categoryId: '16ae4e36-952e-47ae-b7c4-3a88f4ff444e',
        createdBy: 'f6413727-4a29-485e-9db8-29b64aaeb36e',
        createdAt: new Date(),
      },
    ],
  });
}
