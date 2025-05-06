/*
  Warnings:

  - You are about to drop the column `price` on the `ShowTime` table. All the data in the column will be lost.
  - Added the required column `country` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularWeekdayPrice` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularWeekendPrice` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vipWeekdayPrice` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vipWeekendPrice` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShowTime" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Theater" ADD COLUMN     "country" VARCHAR(100) NOT NULL,
ADD COLUMN     "regularWeekdayPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "regularWeekendPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vipWeekdayPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vipWeekendPrice" DOUBLE PRECISION NOT NULL;
