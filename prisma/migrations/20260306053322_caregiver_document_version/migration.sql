/*
  Warnings:

  - You are about to drop the column `documents` on the `CaregiverProfileVersion` table. All the data in the column will be lost.
  - You are about to drop the column `documentversionNumber` on the `CaregiverProfileVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CaregiverProfileVersion" DROP COLUMN "documents",
DROP COLUMN "documentversionNumber";

-- CreateTable
CREATE TABLE "CaregiverDocumentVersion" (
    "id" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "documents" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaregiverDocumentVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CaregiverDocumentVersion" ADD CONSTRAINT "CaregiverDocumentVersion_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
