/*
  Warnings:

  - The values [PENDING] on the enum `CaregiverStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CaregiverStatus_new" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUIRED');
ALTER TABLE "public"."Caregiver" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Caregiver" ALTER COLUMN "status" TYPE "CaregiverStatus_new" USING ("status"::text::"CaregiverStatus_new");
ALTER TYPE "CaregiverStatus" RENAME TO "CaregiverStatus_old";
ALTER TYPE "CaregiverStatus_new" RENAME TO "CaregiverStatus";
DROP TYPE "public"."CaregiverStatus_old";
ALTER TABLE "Caregiver" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
