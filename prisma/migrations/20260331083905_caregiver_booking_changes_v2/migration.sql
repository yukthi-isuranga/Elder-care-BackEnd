/*
  Warnings:

  - You are about to drop the column `emergencyContactName` on the `Caregiver` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContactPhone` on the `Caregiver` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "emergencyContactName",
DROP COLUMN "emergencyContactPhone";
