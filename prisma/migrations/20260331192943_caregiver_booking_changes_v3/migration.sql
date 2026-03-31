-- DropIndex
DROP INDEX "CaregiverDocument_caregiverId_key";

-- AlterTable
ALTER TABLE "CaregiverDocument" ADD COLUMN     "description" TEXT;
