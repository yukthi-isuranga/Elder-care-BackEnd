import { Gender } from './userTypes';

export type Elder = {
  id: string;
  caretakerId: string;

  // Basic Identity
  firstName: string;
  middleName?: string | null;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;
  nic?: string | null;
  bloodGroup?: BloodGroup | null;

  // Physical Information
  heightCm?: number | null;
  weightKg?: number | null;
  mobilityLevel: MobilityLevel;
  visionIssues: boolean;
  hearingIssues: boolean;

  // Medical Profile
  chronicDiseases?: string | null;
  allergies?: string | null;
  currentMedications?: string | null;
  pastSurgeries?: string | null;
  medicalNotes?: string | null;

  // Cognitive & Mental
  hasDementia: boolean;
  hasAlzheimer: boolean;
  hasDepression: boolean;
  cognitiveNotes?: string | null;

  // Care Requirements
  requiresFullTimeCare: boolean;
  requiresNightCare: boolean;
  requiresPhysiotherapy: boolean;
  requiresSpecialDiet: boolean;
  specialNeeds?: string | null;

  // Risk & Monitoring
  fallRiskLevel: RiskLevel;
  requiresMonitoring: boolean;

  // Emergency Info
  emergencyDoctorName?: string | null;
  emergencyDoctorPhone?: string | null;
  preferredHospital?: string | null;

  // System
  isActive: boolean;
  notes?: string | null;

  createdAt: Date;
  updatedAt: Date;
};

export enum BloodGroup {
  A_POSITIVE = 'A_POSITIVE',
  A_NEGATIVE = 'A_NEGATIVE',
  B_POSITIVE = 'B_POSITIVE',
  B_NEGATIVE = 'B_NEGATIVE',
  AB_POSITIVE = 'AB_POSITIVE',
  AB_NEGATIVE = 'AB_NEGATIVE',
  O_POSITIVE = 'O_POSITIVE',
  O_NEGATIVE = 'O_NEGATIVE',
}

export enum MobilityLevel {
  INDEPENDENT = 'INDEPENDENT',
  NEEDS_ASSISTANCE = 'NEEDS_ASSISTANCE',
  WHEELCHAIR = 'WHEELCHAIR',
  BEDRIDDEN = 'BEDRIDDEN',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}
