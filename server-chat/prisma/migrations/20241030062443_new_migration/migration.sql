/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `auths` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auths_username_key" ON "auths"("username");
