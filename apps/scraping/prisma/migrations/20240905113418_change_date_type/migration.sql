/*
  Warnings:

  - Changed the type of `exDividendDate` on the `Dividend` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paymentDate` on the `Dividend` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `releaseDate` on the `Earnings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `releaseDate` on the `EconomicIndicator` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Dividend" DROP COLUMN "exDividendDate",
ADD COLUMN     "exDividendDate" BIGINT NOT NULL,
DROP COLUMN "paymentDate",
ADD COLUMN     "paymentDate" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Earnings" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "EconomicIndicator" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dividend_exDividendDate_companyId_key" ON "Dividend"("exDividendDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Earnings_releaseDate_companyId_key" ON "Earnings"("releaseDate", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicIndicator_releaseDate_name_country_key" ON "EconomicIndicator"("releaseDate", "name", "country");
