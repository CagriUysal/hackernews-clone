/*
  Warnings:

  - You are about to drop the column `upvotes` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "upvotes",
ADD COLUMN     "upvote" INTEGER NOT NULL DEFAULT 0;
