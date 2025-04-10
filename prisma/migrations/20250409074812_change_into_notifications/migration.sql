/*
  Warnings:

  - You are about to drop the column `method` on the `EarningsNotificationSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `IndicatorNotificationSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EarningsNotificationSubscription" DROP COLUMN "method";

-- AlterTable
ALTER TABLE "IndicatorNotificationSubscription" DROP COLUMN "method";
