/*
  Warnings:

  - A unique constraint covering the columns `[userId,contentId,contentType,notificationType]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DATA_CHANGED', 'PAYMENT_DATE', 'RELEASE_DATE');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "notificationType" "NotificationType" NOT NULL DEFAULT 'DATA_CHANGED';

-- AlterTable
ALTER TABLE "NotificationDelivery" ADD COLUMN     "errorCode" TEXT,
ADD COLUMN     "lastAttemptAt" TIMESTAMP(3),
ADD COLUMN     "processingTimeMs" INTEGER,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_contentId_contentType_notificationType_key" ON "Notification"("userId", "contentId", "contentType", "notificationType");

-- CreateIndex
CREATE INDEX "NotificationDelivery_channelKey_status_idx" ON "NotificationDelivery"("channelKey", "status");
