import { PrismaClient } from '@prisma/client';
import { seedUser } from './seeds/user';
import { seedAccount } from './seeds/account';
import { seedCategory } from './seeds/category';
import { seedProduct } from './seeds/product';
import { seedPartners } from './seeds/partner';
import { seedSection } from './seeds/section';
import { seedMedia } from './seeds/media';
import { seedTransaction } from './seeds/transaction';
import { seedProductCategory } from './seeds/productCategory';
import { seedProductTransaction } from './seeds/productTransaction';

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
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
