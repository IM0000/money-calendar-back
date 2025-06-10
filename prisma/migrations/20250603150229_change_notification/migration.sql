/*
  Warnings:

  - You are about to drop the column `method` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `preferredMethod` on the `UserNotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the column `pushEnabled` on the `UserNotificationSettings` table. All the data in the column will be lost.
  - You are about to drop the `EarningsNotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndicatorNotification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `baseName` to the `EconomicIndicator` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SLACK');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropForeignKey
ALTER TABLE "EarningsNotification" DROP CONSTRAINT "EarningsNotification_earningsId_fkey";

-- DropForeignKey
ALTER TABLE "EarningsNotification" DROP CONSTRAINT "EarningsNotification_userId_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorNotification" DROP CONSTRAINT "IndicatorNotification_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorNotification" DROP CONSTRAINT "IndicatorNotification_userId_fkey";

-- DropIndex
DROP INDEX "Notification_userId_read_contentType_idx";

-- AlterTable
-- 1) 컬럼 추가 (NULL 허용)
ALTER TABLE "EconomicIndicator" ADD COLUMN "baseName" TEXT;

-- 2) 기존 데이터 백필
UPDATE "EconomicIndicator" SET "baseName" = "name" WHERE "baseName" IS NULL;

-- 3) NOT NULL 제약 추가
ALTER TABLE "EconomicIndicator" ALTER COLUMN "baseName" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "method",
DROP COLUMN "read",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserNotificationSettings" DROP COLUMN "preferredMethod",
DROP COLUMN "pushEnabled",
ADD COLUMN     "slackEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slackWebhookUrl" TEXT,
ALTER COLUMN "emailEnabled" SET DEFAULT false;

-- DropTable
DROP TABLE "EarningsNotification";

-- DropTable
DROP TABLE "IndicatorNotification";

-- DropEnum
DROP TYPE "NotificationMethod";

-- CreateTable
CREATE TABLE "SubscriptionEarnings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "earningsId" INTEGER,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionEarnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionIndicator" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "baseName" TEXT,
    "country" TEXT,
    "indicatorId" INTEGER,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SubscriptionIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" SERIAL NOT NULL,
    "notificationId" INTEGER NOT NULL,
    "channelKey" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "errorMessage" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubscriptionEarnings_earningsId_isActive_idx" ON "SubscriptionEarnings"("earningsId", "isActive");

-- CreateIndex
CREATE INDEX "SubscriptionEarnings_companyId_isActive_idx" ON "SubscriptionEarnings"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionEarnings_userId_earningsId_key" ON "SubscriptionEarnings"("userId", "earningsId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionEarnings_userId_companyId_key" ON "SubscriptionEarnings"("userId", "companyId");

-- CreateIndex
CREATE INDEX "SubscriptionIndicator_indicatorId_isActive_idx" ON "SubscriptionIndicator"("indicatorId", "isActive");

-- CreateIndex
CREATE INDEX "SubscriptionIndicator_baseName_country_isActive_idx" ON "SubscriptionIndicator"("baseName", "country", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionIndicator_userId_indicatorId_key" ON "SubscriptionIndicator"("userId", "indicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionIndicator_userId_baseName_country_key" ON "SubscriptionIndicator"("userId", "baseName", "country");

-- CreateIndex
CREATE INDEX "NotificationDelivery_notificationId_idx" ON "NotificationDelivery"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_idx" ON "NotificationDelivery"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "SubscriptionEarnings" ADD CONSTRAINT "SubscriptionEarnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionEarnings" ADD CONSTRAINT "SubscriptionEarnings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionEarnings" ADD CONSTRAINT "SubscriptionEarnings_earningsId_fkey" FOREIGN KEY ("earningsId") REFERENCES "Earnings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionIndicator" ADD CONSTRAINT "SubscriptionIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionIndicator" ADD CONSTRAINT "SubscriptionIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "EconomicIndicator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;
