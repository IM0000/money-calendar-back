/*
  Warnings:

  - You are about to drop the column `timing` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - The `method` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `contentType` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'PUSH', 'BOTH');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('EARNINGS', 'DIVIDEND', 'ECONOMIC_INDICATOR');

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "timing",
DROP COLUMN "type",
ADD COLUMN     "contentType" "ContentType" NOT NULL,
DROP COLUMN "method",
ADD COLUMN     "method" "NotificationMethod";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateIndex
CREATE INDEX "Notification_userId_read_contentType_idx" ON "Notification"("userId", "read", "contentType");

-- CreateIndex
CREATE INDEX "Notification_contentType_contentId_idx" ON "Notification"("contentType", "contentId");
