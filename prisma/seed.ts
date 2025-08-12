import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await seedUser();
  // await seedAccount();
  // await seedCategory();
  // await seedPartners();
  // await seedSection();
  // await seedMedia();
  // await seedTransaction();
  // await seedProductCategory();
  // await seedProduct();
  // await seedProductTransaction();
  // await seedHelpsCenter();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
