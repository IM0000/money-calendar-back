-- AlterEnum
ALTER TYPE "public"."NotificationChannel" ADD VALUE 'DISCORD';

-- AlterTable
ALTER TABLE "public"."UserNotificationSettings" ADD COLUMN     "discordEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discordWebhookUrl" TEXT;
