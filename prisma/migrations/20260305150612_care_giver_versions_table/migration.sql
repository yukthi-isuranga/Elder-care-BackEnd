-- CreateTable
CREATE TABLE "CaretakerProfileVersion" (
    "id" TEXT NOT NULL,
    "caretakerId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "status" "CaregiverStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaretakerProfileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CaretakerProfileVersion_caretakerId_versionNumber_idx" ON "CaretakerProfileVersion"("caretakerId", "versionNumber");

-- AddForeignKey
ALTER TABLE "CaretakerProfileVersion" ADD CONSTRAINT "CaretakerProfileVersion_caretakerId_fkey" FOREIGN KEY ("caretakerId") REFERENCES "Caretaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
