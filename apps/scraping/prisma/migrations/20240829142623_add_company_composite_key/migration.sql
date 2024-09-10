/*
  Warnings:

  - A unique constraint covering the columns `[ticker,country]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Company_ticker_key";

-- CreateIndex
CREATE UNIQUE INDEX "Company_ticker_country_key" ON "Company"("ticker", "country");
