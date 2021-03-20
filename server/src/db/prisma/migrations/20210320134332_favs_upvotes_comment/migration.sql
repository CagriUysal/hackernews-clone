/*
  Warnings:

  - You are about to drop the `_Favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Upvotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Favorites" DROP CONSTRAINT "_Favorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_Favorites" DROP CONSTRAINT "_Favorites_B_fkey";

-- DropForeignKey
ALTER TABLE "_Upvotes" DROP CONSTRAINT "_Upvotes_A_fkey";

-- DropForeignKey
ALTER TABLE "_Upvotes" DROP CONSTRAINT "_Upvotes_B_fkey";

-- CreateTable
CREATE TABLE "_FavoritePosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UpvotedPosts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_FavoritedComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UpvotedComments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- DropTable
DROP TABLE "_Favorites";

-- DropTable
DROP TABLE "_Upvotes";

-- CreateIndex
CREATE UNIQUE INDEX "_FavoritePosts_AB_unique" ON "_FavoritePosts"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoritePosts_B_index" ON "_FavoritePosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UpvotedPosts_AB_unique" ON "_UpvotedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvotedPosts_B_index" ON "_UpvotedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FavoritedComments_AB_unique" ON "_FavoritedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoritedComments_B_index" ON "_FavoritedComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UpvotedComments_AB_unique" ON "_UpvotedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_UpvotedComments_B_index" ON "_UpvotedComments"("B");

-- AddForeignKey
ALTER TABLE "_FavoritePosts" ADD FOREIGN KEY("A")REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritePosts" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvotedPosts" ADD FOREIGN KEY("A")REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvotedPosts" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedComments" ADD FOREIGN KEY("A")REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedComments" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvotedComments" ADD FOREIGN KEY("A")REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UpvotedComments" ADD FOREIGN KEY("B")REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
