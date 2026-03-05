/*
  Warnings:

  - You are about to drop the `CaretakerProfileVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CaretakerProfileVersion" DROP CONSTRAINT "CaretakerProfileVersion_caretakerId_fkey";

-- DropTable
DROP TABLE "CaretakerProfileVersion";

-- CreateTable
CREATE TABLE "CaregiverProfileVersion" (
    "id" TEXT NOT NULL,
    "caregiverId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "status" "CaregiverStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaregiverProfileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaregiverProfileVersion_caregiverId_versionNumber_idx" ON "CaregiverProfileVersion"("caregiverId", "versionNumber");

-- AddForeignKey
ALTER TABLE "CaregiverProfileVersion" ADD CONSTRAINT "CaregiverProfileVersion_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "Caregiver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
