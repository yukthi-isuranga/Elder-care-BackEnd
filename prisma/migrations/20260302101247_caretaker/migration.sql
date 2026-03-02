/*
  Warnings:

  - A unique constraint covering the columns `[nic]` on the table `Caregiver` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `gender` on the `Caregiver` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('SON', 'DAUGHTER', 'SPOUSE', 'RELATIVE', 'LEGAL_GUARDIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('INDEPENDENT', 'NEEDS_ASSISTANCE', 'WHEELCHAIR', 'BEDRIDDEN');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "Caregiver" ADD COLUMN     "availableForFullTime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availableForNight" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "availableTo" TIMESTAMP(3),
ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "backgroundCheckDate" TIMESTAMP(3),
ADD COLUMN     "canAdministerMedication" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canHandleBedridden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canHandleDementia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canHandleEmergency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canHandleWheelchair" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canProvidePhysiotherapy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isBackgroundChecked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isIdentityVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languagesSpoken" TEXT,
ADD COLUMN     "qualifications" TEXT,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "totalCompletedJobs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- CreateTable
CREATE TABLE "Caretaker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "nameWithInitials" TEXT,
    "nic" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "district" "District" NOT NULL,
    "postalCode" TEXT,
    "relationshipToElder" "RelationshipType" NOT NULL,
    "relationshitTypeOther" TEXT,
    "isPrimaryContact" BOOLEAN NOT NULL DEFAULT true,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactRelation" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Caretaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Elder" (
    "id" TEXT NOT NULL,
    "caretakerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nic" TEXT,
    "bloodGroup" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "mobilityLevel" "MobilityLevel" NOT NULL,
    "visionIssues" BOOLEAN NOT NULL DEFAULT false,
    "hearingIssues" BOOLEAN NOT NULL DEFAULT false,
    "chronicDiseases" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "pastSurgeries" TEXT,
    "medicalNotes" TEXT,
    "hasDementia" BOOLEAN NOT NULL DEFAULT false,
    "hasAlzheimer" BOOLEAN NOT NULL DEFAULT false,
    "hasDepression" BOOLEAN NOT NULL DEFAULT false,
    "cognitiveNotes" TEXT,
    "requiresFullTimeCare" BOOLEAN NOT NULL DEFAULT false,
    "requiresNightCare" BOOLEAN NOT NULL DEFAULT false,
    "requiresPhysiotherapy" BOOLEAN NOT NULL DEFAULT false,
    "requiresSpecialDiet" BOOLEAN NOT NULL DEFAULT false,
    "specialNeeds" TEXT,
    "fallRiskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "requiresMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "emergencyDoctorName" TEXT,
    "emergencyDoctorPhone" TEXT,
    "preferredHospital" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Elder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Caretaker_userId_key" ON "Caretaker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_nic_key" ON "Caregiver"("nic");

-- AddForeignKey
ALTER TABLE "Caretaker" ADD CONSTRAINT "Caretaker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elder" ADD CONSTRAINT "Elder_caretakerId_fkey" FOREIGN KEY ("caretakerId") REFERENCES "Caretaker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
