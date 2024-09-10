/*
  Warnings:

  - Added the required column `country` to the `Dividend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Earnings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dividend" ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Earnings" ADD COLUMN     "country" TEXT NOT NULL;
