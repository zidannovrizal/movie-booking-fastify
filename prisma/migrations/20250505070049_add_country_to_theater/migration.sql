/*
  Warnings:

  - You are about to drop the column `regularWeekdayPrice` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `regularWeekendPrice` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `vipWeekdayPrice` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `vipWeekendPrice` on the `Theater` table. All the data in the column will be lost.
  - Added the required column `price` to the `ShowTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowTime" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "regularWeekdayPrice",
DROP COLUMN "regularWeekendPrice",
DROP COLUMN "vipWeekdayPrice",
DROP COLUMN "vipWeekendPrice";
