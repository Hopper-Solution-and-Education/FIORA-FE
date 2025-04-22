/*
  Warnings:

  - You are about to drop the column `items` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identify]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taxNo]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Partner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'Invest';

-- AlterEnum
ALTER TYPE "ProductType" ADD VALUE 'Edu';

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toAccountId_fkey";

-- AlterTable
ALTER TABLE "CategoryProducts" ADD COLUMN     "createdBy" UUID,
ADD COLUMN     "updatedBy" UUID;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "items",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'VND';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "ProductItems" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "ProductItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductItems_userId_productId_idx" ON "ProductItems"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_identify_key" ON "Partner"("identify");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_taxNo_key" ON "Partner"("taxNo");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_phone_key" ON "Partner"("phone");

-- CreateIndex
CREATE INDEX "Product_userId_catId_idx" ON "Product"("userId", "catId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catId_fkey" FOREIGN KEY ("catId") REFERENCES "CategoryProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItems" ADD CONSTRAINT "ProductItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItems" ADD CONSTRAINT "ProductItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryProducts" ADD CONSTRAINT "CategoryProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
