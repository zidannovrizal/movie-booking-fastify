/*
  Warnings:

  - You are about to alter the column `city` on the `Theater` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Theater" ALTER COLUMN "city" SET DATA TYPE VARCHAR(100);
