/*
  Warnings:

  - Added the required column `address` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Theater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Theater` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theater" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "facilities" TEXT[],
ADD COLUMN     "location" TEXT NOT NULL;
