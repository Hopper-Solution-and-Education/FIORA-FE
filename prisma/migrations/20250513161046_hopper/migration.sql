-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('Top', 'Bot', 'Act');

-- CreateEnum
CREATE TYPE "BudgetDetailType" AS ENUM ('Income', 'Expense');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'EMBEDDED');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('BANNER', 'VISION_MISSION', 'KPS', 'PARTNER_LOGO', 'FOOTER', 'HEADER', 'REVIEW', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Expense', 'Income');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Payment', 'Saving', 'CreditCard', 'Debt', 'Lending', 'Invest');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('VND', 'USD');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Expense', 'Income', 'Transfer');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Product', 'Service', 'Edu');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User', 'CS');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "image" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "role" "UserRole" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "icon" TEXT,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "type" "AccountType" NOT NULL DEFAULT 'Payment',
    "currency" "Currency" NOT NULL DEFAULT 'VND',
    "limit" DECIMAL(13,2) DEFAULT 0,
    "balance" DECIMAL(13,2) DEFAULT 0,
    "parentId" UUID,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "color" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "UserAuthentication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "catId" UUID,
    "type" "ProductType" NOT NULL,
    "icon" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "price" DECIMAL(13,2) NOT NULL,
    "taxRate" DECIMAL(13,2),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "currency" "Currency" NOT NULL DEFAULT 'VND',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductItems" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "ProductItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryProducts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "icon" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "tax_rate" DECIMAL(13,2),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "CategoryProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "date" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(13,2) NOT NULL,
    "fromAccountId" UUID,
    "fromCategoryId" UUID,
    "toAccountId" UUID,
    "toCategoryId" UUID,
    "products" JSONB,
    "partnerId" UUID,
    "remark" VARCHAR(255),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ(0),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "updatedBy" UUID,
    "createdBy" UUID,
    "currency" "Currency" NOT NULL DEFAULT 'VND',

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTransaction" (
    "productId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "ProductTransaction_pkey" PRIMARY KEY ("productId","transactionId")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "logo" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "identify" VARCHAR(50),
    "dob" DATE,
    "taxNo" VARCHAR(20),
    "address" VARCHAR(255),
    "email" VARCHAR(50),
    "phone" VARCHAR(50),
    "description" VARCHAR(1000),
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "parentId" UUID,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" UUID NOT NULL,
    "section_type" "SectionType" NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" UUID NOT NULL,
    "media_type" "MediaType" NOT NULL,
    "media_url" TEXT,
    "embed_code" TEXT,
    "description" TEXT,
    "uploaded_by" TEXT,
    "uploaded_date" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "section_id" UUID,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "redirect_url" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "CategoryType" NOT NULL,
    "icon" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1000),
    "parentId" UUID,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "createdBy" UUID,
    "updatedBy" UUID,
    "balance" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "tax_rate" DECIMAL(13,2),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetsTable" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "fiscalYear" SMALLINT NOT NULL,
    "type" "BudgetType" NOT NULL DEFAULT 'Top',
    "total_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "total_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "h1_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "h1_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "h2_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "h2_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q1_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q1_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q2_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q2_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q3_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q3_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q4_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "q4_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m1_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m1_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m2_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m2_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m3_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m3_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m4_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m4_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m5_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m5_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m6_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m6_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m7_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m7_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m8_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m8_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m9_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m9_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m10_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m10_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m11_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m11_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m12_exp" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "m12_inc" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'VND',

    CONSTRAINT "BudgetsTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetDetails" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "budgetId" UUID NOT NULL,
    "type" "BudgetDetailType" NOT NULL,
    "categoryId" UUID,
    "amount" DECIMAL(13,2) NOT NULL DEFAULT 0,
    "month" SMALLINT NOT NULL,
    "createdAt" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedBy" UUID,
    "updatedAt" TIMESTAMPTZ(0) NOT NULL,

    CONSTRAINT "BudgetDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_isDeleted_idx" ON "User"("isDeleted");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_parentId_idx" ON "Account"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_userId_key" ON "UserAuthentication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_provider_providerAccountId_key" ON "UserAuthentication"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "Product_userId_idx" ON "Product"("userId");

-- CreateIndex
CREATE INDEX "Product_catId_idx" ON "Product"("catId");

-- CreateIndex
CREATE INDEX "Product_userId_catId_idx" ON "Product"("userId", "catId");

-- CreateIndex
CREATE INDEX "ProductItems_userId_productId_idx" ON "ProductItems"("userId", "productId");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");

-- CreateIndex
CREATE INDEX "Transaction_userId_type_date_idx" ON "Transaction"("userId", "type", "date");

-- CreateIndex
CREATE INDEX "Partner_userId_idx" ON "Partner"("userId");

-- CreateIndex
CREATE INDEX "Partner_parentId_idx" ON "Partner"("parentId");

-- CreateIndex
CREATE INDEX "Category_userId_idx" ON "Category"("userId");

-- CreateIndex
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

-- CreateIndex
CREATE INDEX "BudgetsTable_userId_idx" ON "BudgetsTable"("userId");

-- CreateIndex
CREATE INDEX "BudgetsTable_fiscalYear_idx" ON "BudgetsTable"("fiscalYear");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetsTable_fiscalYear_type_userId_key" ON "BudgetsTable"("fiscalYear", "type", "userId");

-- CreateIndex
CREATE INDEX "BudgetDetails_userId_idx" ON "BudgetDetails"("userId");

-- CreateIndex
CREATE INDEX "BudgetDetails_budgetId_idx" ON "BudgetDetails"("budgetId");

-- CreateIndex
CREATE INDEX "BudgetDetails_categoryId_idx" ON "BudgetDetails"("categoryId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAuthentication" ADD CONSTRAINT "UserAuthentication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_catId_fkey" FOREIGN KEY ("catId") REFERENCES "CategoryProducts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItems" ADD CONSTRAINT "ProductItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductItems" ADD CONSTRAINT "ProductItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryProducts" ADD CONSTRAINT "CategoryProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromCategoryId_fkey" FOREIGN KEY ("fromCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toCategoryId_fkey" FOREIGN KEY ("toCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTransaction" ADD CONSTRAINT "ProductTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "Section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetsTable" ADD CONSTRAINT "BudgetsTable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetDetails" ADD CONSTRAINT "BudgetDetails_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetsTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetDetails" ADD CONSTRAINT "BudgetDetails_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetDetails" ADD CONSTRAINT "BudgetDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
