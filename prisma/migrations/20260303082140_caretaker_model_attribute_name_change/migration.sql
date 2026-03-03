/*
  Warnings:

  - You are about to drop the column `relationshitTypeOther` on the `Caretaker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caretaker" DROP COLUMN "relationshitTypeOther",
ADD COLUMN     "relationshipTypeOther" TEXT;
