/*
  Warnings:

  - You are about to drop the column `showTimeId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `ShowTime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `showDate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `showTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `theaterId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmdbMovieId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularPriceWeekday` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regularPriceWeekend` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vipPriceWeekday` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vipPriceWeekend` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_showTimeId_fkey";

-- DropForeignKey
ALTER TABLE "ShowTime" DROP CONSTRAINT "ShowTime_theaterId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "showTimeId",
ADD COLUMN     "isVIP" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "showTime" TEXT NOT NULL,
ADD COLUMN     "theaterId" TEXT NOT NULL,
ADD COLUMN     "tmdbMovieId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Theater" ADD COLUMN     "regularPriceWeekday" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "regularPriceWeekend" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "showTimes" TEXT[],
ADD COLUMN     "vipPriceWeekday" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vipPriceWeekend" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "ShowTime";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
