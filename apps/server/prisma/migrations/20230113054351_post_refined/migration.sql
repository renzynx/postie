/*
  Warnings:

  - The primary key for the `posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The required column `uuid` was added to the `posts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_votes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_votes" ("created_at", "id", "post_id", "user_id", "value") SELECT "created_at", "id", "post_id", "user_id", "value" FROM "votes";
DROP TABLE "votes";
ALTER TABLE "new_votes" RENAME TO "votes";
CREATE UNIQUE INDEX "votes_post_id_user_id_key" ON "votes"("post_id", "user_id");
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "uuid" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" INTEGER NOT NULL,
    CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("author_id", "content", "created_at", "id", "published", "title") SELECT "author_id", "content", "created_at", "id", "published", "title" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
CREATE UNIQUE INDEX "posts_uuid_key" ON "posts"("uuid");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
