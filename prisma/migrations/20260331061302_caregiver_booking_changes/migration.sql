/*
  Warnings:

  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Caregiver` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine1` to the `Caregiver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Caregiver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "district" "District" NOT NULL,
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requiresFullTimeCare" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresNightCare" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresPhysiotherapy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiresSpecialDiet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Caregiver" DROP COLUMN "address",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "secondaryPhone" TEXT;
