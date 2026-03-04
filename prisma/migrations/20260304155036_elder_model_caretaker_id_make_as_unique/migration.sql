/*
  Warnings:

  - A unique constraint covering the columns `[caretakerId]` on the table `Elder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Elder_caretakerId_key" ON "Elder"("caretakerId");
