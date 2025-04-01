-- CreateEnum
CREATE TYPE "ReleaseTiming" AS ENUM ('UNKNOWN', 'PRE_MARKET', 'POST_MARKET');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EARNINGS', 'DIVIDEND', 'ECONOMIC_INDICATOR');

-- AlterTable
ALTER TABLE "OAuthAccount" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserNotificationSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "preferredMethod" TEXT NOT NULL DEFAULT 'BOTH',
    "defaultTiming" TEXT NOT NULL DEFAULT 'ONE_DAY_BEFORE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "ticker" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Earnings" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "releaseDate" BIGINT NOT NULL,
    "releaseTiming" "ReleaseTiming" NOT NULL DEFAULT 'UNKNOWN',
    "actualEPS" TEXT NOT NULL,
    "forecastEPS" TEXT NOT NULL,
    "previousEPS" TEXT NOT NULL,
    "actualRevenue" TEXT NOT NULL,
    "forecastRevenue" TEXT NOT NULL,
    "previousRevenue" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dividend" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "exDividendDate" BIGINT NOT NULL,
    "dividendAmount" TEXT NOT NULL,
    "previousDividendAmount" TEXT NOT NULL,
    "paymentDate" BIGINT NOT NULL,
    "dividendYield" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicIndicator" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "releaseDate" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "importance" INTEGER NOT NULL,
    "actual" TEXT NOT NULL,
    "forecast" TEXT NOT NULL,
    "previous" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomicIndicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteEarnings" (
    "userId" INTEGER NOT NULL,
    "earningsId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteEarnings_pkey" PRIMARY KEY ("userId","earningsId")
);

-- CreateTable
CREATE TABLE "FavoriteDividends" (
    "userId" INTEGER NOT NULL,
    "dividendId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteDividends_pkey" PRIMARY KEY ("userId","dividendId")
);

-- CreateTable
CREATE TABLE "FavoriteIndicator" (
    "userId" INTEGER NOT NULL,
    "indicatorId" INTEGER NOT NULL,

    CONSTRAINT "FavoriteIndicator_pkey" PRIMARY KEY ("userId","indicatorId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "contentId" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "method" TEXT,
    "timing" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationSettings_userId_key" ON "UserNotificationSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ticker_country_key" ON "Company"("ticker", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Earnings_releaseDate_companyId_key" ON "Earnings"("releaseDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Dividend_exDividendDate_companyId_key" ON "Dividend"("exDividendDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicIndicator_releaseDate_name_country_key" ON "EconomicIndicator"("releaseDate", "name", "country");

-- AddForeignKey
ALTER TABLE "UserNotificationSettings" ADD CONSTRAINT "UserNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Earnings" ADD CONSTRAINT "Earnings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dividend" ADD CONSTRAINT "Dividend_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteEarnings" ADD CONSTRAINT "FavoriteEarnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteEarnings" ADD CONSTRAINT "FavoriteEarnings_earningsId_fkey" FOREIGN KEY ("earningsId") REFERENCES "Earnings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDividends" ADD CONSTRAINT "FavoriteDividends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteDividends" ADD CONSTRAINT "FavoriteDividends_dividendId_fkey" FOREIGN KEY ("dividendId") REFERENCES "Dividend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteIndicator" ADD CONSTRAINT "FavoriteIndicator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteIndicator" ADD CONSTRAINT "FavoriteIndicator_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "EconomicIndicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
