/*
  Warnings:

  - You are about to drop the column `image` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
