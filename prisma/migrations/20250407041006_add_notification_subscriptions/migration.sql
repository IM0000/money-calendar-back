-- CreateTable
CREATE TABLE "IndicatorNotificationSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "indicatorId" INTEGER NOT NULL,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndicatorNotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningsNotificationSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "earningsId" INTEGER NOT NULL,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EarningsNotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IndicatorNotificationSubscription_userId_indicatorId_key" ON "IndicatorNotificationSubscription"("userId", "indicatorId");

-- CreateIndex
CREATE UNIQUE INDEX "EarningsNotificationSubscription_userId_earningsId_key" ON "EarningsNotificationSubscription"("userId", "earningsId");

-- AddForeignKey
ALTER TABLE "IndicatorNotificationSubscription" ADD CONSTRAINT "IndicatorNotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndicatorNotificationSubscription" ADD CONSTRAINT "IndicatorNotificationSubscription_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "EconomicIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsNotificationSubscription" ADD CONSTRAINT "EarningsNotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningsNotificationSubscription" ADD CONSTRAINT "EarningsNotificationSubscription_earningsId_fkey" FOREIGN KEY ("earningsId") REFERENCES "Earnings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
