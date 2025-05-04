/*
  Warnings:

  - The values [PAID,COMPLETED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ENDED] on the enum `MovieStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `paymentId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `cast` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `director` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `subtitles` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `synopsis` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `trailerUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `ShowTime` table. All the data in the column will be lost.
  - You are about to drop the column `hallNumber` on the `ShowTime` table. All the data in the column will be lost.
  - You are about to drop the column `seatingMap` on the `ShowTime` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `facilities` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Theater` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `rating` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `capacity` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MovieStatus_new" AS ENUM ('NOW_SHOWING', 'COMING_SOON');
ALTER TABLE "Movie" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Movie" ALTER COLUMN "status" TYPE "MovieStatus_new" USING ("status"::text::"MovieStatus_new");
ALTER TYPE "MovieStatus" RENAME TO "MovieStatus_old";
ALTER TYPE "MovieStatus_new" RENAME TO "MovieStatus";
DROP TYPE "MovieStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentId";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "cast",
DROP COLUMN "director",
DROP COLUMN "language",
DROP COLUMN "subtitles",
DROP COLUMN "synopsis",
DROP COLUMN "trailerUrl",
ADD COLUMN     "description" TEXT NOT NULL,
DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL,
ALTER COLUMN "genre" SET NOT NULL,
ALTER COLUMN "genre" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ShowTime" DROP COLUMN "endTime",
DROP COLUMN "hallNumber",
DROP COLUMN "seatingMap";

-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "facilities",
DROP COLUMN "location",
ADD COLUMN     "capacity" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");
