/*
  Warnings:

  - A unique constraint covering the columns `[exDividendDate,companyId]` on the table `Dividend` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[releaseDate,companyId]` on the table `Earnings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,country,releaseDate]` on the table `EconomicIndicator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dividend_exDividendDate_companyId_key" ON "Dividend"("exDividendDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Earnings_releaseDate_companyId_key" ON "Earnings"("releaseDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicIndicator_name_country_releaseDate_key" ON "EconomicIndicator"("name", "country", "releaseDate");
