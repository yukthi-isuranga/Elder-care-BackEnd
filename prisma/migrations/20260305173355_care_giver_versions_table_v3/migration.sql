/*
  Warnings:

  - A unique constraint covering the columns `[caregiverId]` on the table `CaregiverDocument` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentversionNumber` to the `CaregiverProfileVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaregiverProfileVersion" ADD COLUMN     "documents" JSONB,
ADD COLUMN     "documentversionNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CaregiverDocument_caregiverId_key" ON "CaregiverDocument"("caregiverId");
