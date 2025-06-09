/*
  Warnings:

  - You are about to drop the `FavoriteDividends` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteEarnings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FavoriteIndicator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionEarnings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionIndicator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FavoriteDividends" DROP CONSTRAINT "FavoriteDividends_dividendId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteDividends" DROP CONSTRAINT "FavoriteDividends_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEarnings" DROP CONSTRAINT "FavoriteEarnings_earningsId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteEarnings" DROP CONSTRAINT "FavoriteEarnings_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteIndicator" DROP CONSTRAINT "FavoriteIndicator_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteIndicator" DROP CONSTRAINT "FavoriteIndicator_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionEarnings" DROP CONSTRAINT "SubscriptionEarnings_companyId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionEarnings" DROP CONSTRAINT "SubscriptionEarnings_earningsId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionEarnings" DROP CONSTRAINT "SubscriptionEarnings_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionIndicator" DROP CONSTRAINT "SubscriptionIndicator_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionIndicator" DROP CONSTRAINT "SubscriptionIndicator_userId_fkey";

-- AlterTable
ALTER TABLE "UserNotificationSettings" ADD COLUMN     "allEnabled" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "FavoriteDividends";

-- DropTable
DROP TABLE "FavoriteEarnings";

-- DropTable
DROP TABLE "FavoriteIndicator";

-- DropTable
DROP TABLE "SubscriptionEarnings";

-- DropTable
DROP TABLE "SubscriptionIndicator";

-- CreateTable
CREATE TABLE "FavoriteCompany" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "favoritedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FavoriteCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteIndicatorGroup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "baseName" TEXT NOT NULL,
    "country" TEXT,
    "favoritedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FavoriteIndicatorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionCompany" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionIndicatorGroup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "baseName" TEXT NOT NULL,
    "country" TEXT,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionIndicatorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteCompany_companyId_isActive_idx" ON "FavoriteCompany"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteCompany_userId_companyId_key" ON "FavoriteCompany"("userId", "companyId");

-- CreateIndex
CREATE INDEX "FavoriteIndicatorGroup_baseName_country_isActive_idx" ON "FavoriteIndicatorGroup"("baseName", "country", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteIndicatorGroup_userId_baseName_country_key" ON "FavoriteIndicatorGroup"("userId", "baseName", "country");

-- CreateIndex
CREATE INDEX "SubscriptionCompany_companyId_isActive_idx" ON "SubscriptionCompany"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionCompany_userId_companyId_key" ON "SubscriptionCompany"("userId", "companyId");

-- CreateIndex
CREATE INDEX "SubscriptionIndicatorGroup_baseName_country_isActive_idx" ON "SubscriptionIndicatorGroup"("baseName", "country", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionIndicatorGroup_userId_baseName_country_key" ON "SubscriptionIndicatorGroup"("userId", "baseName", "country");

-- AddForeignKey
ALTER TABLE "FavoriteCompany" ADD CONSTRAINT "FavoriteCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteCompany" ADD CONSTRAINT "FavoriteCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteIndicatorGroup" ADD CONSTRAINT "FavoriteIndicatorGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionCompany" ADD CONSTRAINT "SubscriptionCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionCompany" ADD CONSTRAINT "SubscriptionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionIndicatorGroup" ADD CONSTRAINT "SubscriptionIndicatorGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
