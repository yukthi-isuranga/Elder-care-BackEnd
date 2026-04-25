import { CaregiverStatus, District } from '../../prisma/generated/enums';

export type CaregiverResponce = {
  id: string;
  userId: string;

  firstName: string;
  middleName?: string | null;
  lastName: string;
  nameWithInitials?: string | null;

  phone: string;
  nic: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: Date;

  secondaryPhone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  postalCode?: string | null;
  district: District;

  experienceYears: number;
  bio?: string | null;
  hourlyRate?: number | null;

  status: CaregiverStatus;

  adminNote?: string | null;
  approvedById?: string | null;

  createdAt: Date;
  updatedAt: Date;

  // Professional
  qualifications?: string | null;
  certifications?: string | null;
  specialization?: string | null;
  languagesSpoken?: string | null;

  // Skills
  canHandleDementia: boolean;
  canHandleBedridden: boolean;
  canHandleWheelchair: boolean;
  canProvidePhysiotherapy: boolean;
  canAdministerMedication: boolean;
  canHandleEmergency: boolean;

  // Availability
  isAvailable: boolean;
  availableFrom?: Date | null;
  availableTo?: Date | null;
  availableForNight: boolean;
  availableForFullTime: boolean;

  // Verification
  isIdentityVerified: boolean;
  isBackgroundChecked: boolean;
  backgroundCheckDate?: Date | null;

  // Ratings
  averageRating?: number | null;
  totalReviews: number;
  totalCompletedJobs: number;

  // System
  isActive: boolean;
};
