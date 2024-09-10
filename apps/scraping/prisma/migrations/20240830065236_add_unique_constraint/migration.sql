/*
  Warnings:

  - A unique constraint covering the columns `[releaseDate,name,country]` on the table `EconomicIndicator` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EconomicIndicator_name_country_releaseDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "EconomicIndicator_releaseDate_name_country_key" ON "EconomicIndicator"("releaseDate", "name", "country");
