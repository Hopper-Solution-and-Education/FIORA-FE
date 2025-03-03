/*
  Warnings:

  - The values [image,video,embedded] on the enum `MediaType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('BANNER', 'VISION_MISSION', 'KPS', 'PARTNER_LOGO');

-- AlterEnum
BEGIN;
CREATE TYPE "MediaType_new" AS ENUM ('IMAGE', 'VIDEO', 'EMBEDDED');
ALTER TABLE "Media" ALTER COLUMN "media_type" TYPE "MediaType_new" USING ("media_type"::text::"MediaType_new");
ALTER TYPE "MediaType" RENAME TO "MediaType_old";
ALTER TYPE "MediaType_new" RENAME TO "MediaType";
DROP TYPE "MediaType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_media_id_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "section_id" INTEGER;

-- DropTable
DROP TABLE "Banner";

-- CreateTable
CREATE TABLE "Section" (
    "section_id" SERIAL NOT NULL,
    "section_type" "SectionType" NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("section_id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("section_id") ON DELETE SET NULL ON UPDATE CASCADE;
