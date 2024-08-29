-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthInfo" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OauthInfo_pkey" PRIMARY KEY ("id")
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
    "releaseDate" TIMESTAMP(3) NOT NULL,
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
    "exDividendDate" TIMESTAMP(3) NOT NULL,
    "dividendAmount" TEXT NOT NULL,
    "previousDividendAmount" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dividend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicIndicator" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "provider_providerId_idx" ON "OauthInfo"("provider", "providerId");

-- CreateIndex
CREATE INDEX "userId_idx" ON "OauthInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_ticker_key" ON "Company"("ticker");

-- AddForeignKey
ALTER TABLE "OauthInfo" ADD CONSTRAINT "OauthInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
