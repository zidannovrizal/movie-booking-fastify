/*
  Warnings:

  - You are about to drop the column `movieId` on the `ShowTime` table. All the data in the column will be lost.
  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tmdbMovieId` to the `ShowTime` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShowTime" DROP CONSTRAINT "ShowTime_movieId_fkey";

-- AlterTable
ALTER TABLE "ShowTime" DROP COLUMN "movieId",
ADD COLUMN     "tmdbMovieId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Movie";

-- DropEnum
DROP TYPE "MovieStatus";
