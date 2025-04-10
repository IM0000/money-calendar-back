/*
  Warnings:

  - You are about to drop the `EarningsNotificationSubscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IndicatorNotificationSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EarningsNotificationSubscription" DROP CONSTRAINT "EarningsNotificationSubscription_earningsId_fkey";

-- DropForeignKey
ALTER TABLE "EarningsNotificationSubscription" DROP CONSTRAINT "EarningsNotificationSubscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorNotificationSubscription" DROP CONSTRAINT "IndicatorNotificationSubscription_indicatorId_fkey";

-- DropForeignKey
ALTER TABLE "IndicatorNotificationSubscription" DROP CONSTRAINT "IndicatorNotificationSubscription_userId_fkey";

-- DropTable
DROP TABLE "EarningsNotificationSubscription";

-- DropTable
DROP TABLE "IndicatorNotificationSubscription";

-- CreateTable
CREATE TABLE "IndicatorNotification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicatorNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsNotification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "earningsId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarningsNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndicatorNotification_userId_indicatorId_key" ON "IndicatorNotification"("userId", "indicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "EarningsNotification_userId_earningsId_key" ON "EarningsNotification"("userId", "earningsId");

-- AddForeignKey
ALTER TABLE "IndicatorNotification" ADD CONSTRAINT "IndicatorNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorNotification" ADD CONSTRAINT "IndicatorNotification_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "EconomicIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsNotification" ADD CONSTRAINT "EarningsNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsNotification" ADD CONSTRAINT "EarningsNotification_earningsId_fkey" FOREIGN KEY ("earningsId") REFERENCES "Earnings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
