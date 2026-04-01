// types/caregiver.ts
export type CaregiverBasicInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nameWithInitials?: string;
  phone: string;
  secondaryPhone?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string; // ISO string
  nic: string;
  status: CaregiverStatus;
  adminNote: string;
  approvedById: string;
};

// =============================
// PROFESSIONAL INFO
// =============================
export type CaregiverProfessionalInfo = {
  experienceYears: number;
  bio?: string;
  hourlyRate?: number;
  qualifications?: string; // NEW
  certifications?: string; // NEW
  specialization?: string; // NEW
  languagesSpoken?: string; // NEW
};

// =============================
// SKILL FLAGS
// =============================
export type CaregiverSkills = {
  canHandleDementia?: boolean; // NEW
  canHandleBedridden?: boolean; // NEW
  canHandleWheelchair?: boolean; // NEW
  canProvidePhysiotherapy?: boolean; // NEW
  canAdministerMedication?: boolean; // NEW
  canHandleEmergency?: boolean; // NEW
};

// =============================
// AVAILABILITY
// =============================
export type CaregiverAvailability = {
  isAvailable?: boolean; // NEW
  availableFrom?: string; // NEW - ISO string
  availableTo?: string; // NEW - ISO string
  availableForNight?: boolean; // NEW
  availableForFullTime?: boolean; // NEW
};

// =============================
// SAFETY & VERIFICATION
// =============================
export type CaregiverVerification = {
  isIdentityVerified?: boolean; // NEW - admin controlled
  isBackgroundChecked?: boolean; // NEW - admin controlled
  backgroundCheckDate?: string; // NEW - ISO string
  emergencyContactName?: string; // NEW
  emergencyContactPhone?: string; // NEW
};

// =============================
// PERFORMANCE
// =============================
export type CaregiverPerformance = {
  averageRating?: number; // NEW - calculated field
  totalReviews?: number; // NEW - calculated field
  totalCompletedJobs?: number; // NEW - calculated field
  isActive?: boolean; // NEW - soft delete flag
};

// =============================
// ADDRESS
// =============================
export type CaregiverAddress = {
  // line1: string;
  // line2?: string;
  // address: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  city: string;
  district: District;
  // province: string;
  // postalCode?: string;
};

// =============================
// DOCUMENTS
// =============================
export type CaregiverDocument = {
  type: 'NIC' | 'CERTIFICATE' | 'POLICE_REPORT';
  fileUrl: string;
};

// =============================
// CREATE REQUEST
// =============================
export type CaregiverCreateRequest = CaregiverBasicInfo &
  CaregiverProfessionalInfo &
  CaregiverSkills & // NEW
  CaregiverPerformance & //NEW
  CaregiverAvailability & // NEW
  CaregiverVerification & // NEW
  CaregiverAddress & {
    documents?: CaregiverDocument[];
  };
export enum District {
  // Western Province
  COLOMBO = 'COLOMBO',
  GAMPAHA = 'GAMPAHA',
  KALUTARA = 'KALUTARA',

  // Central Province
  KANDY = 'KANDY',
  MATALE = 'MATALE',
  NUWARA_ELIYA = 'NUWARA_ELIYA',

  // Southern Province
  GALLE = 'GALLE',
  MATARA = 'MATARA',
  HAMBANTOTA = 'HAMBANTOTA',

  // Northern Province
  JAFFNA = 'JAFFNA',
  KILINOCHCHI = 'KILINOCHCHI',
  MANNAR = 'MANNAR',
  MULLAITIVU = 'MULLAITIVU',
  VAVUNIYA = 'VAVUNIYA',

  // Eastern Province
  TRINCOMALEE = 'TRINCOMALEE',
  BATTICALOA = 'BATTICALOA',
  AMPARA = 'AMPARA',

  // North Western Province
  KURUNEGALA = 'KURUNEGALA',
  PUTTALAM = 'PUTTALAM',

  // North Central Province
  ANURADHAPURA = 'ANURADHAPURA',
  POLONNARUWA = 'POLONNARUWA',

  // Uva Province
  BADULLA = 'BADULLA',
  MONARAGALA = 'MONARAGALA',

  // Sabaragamuwa Province
  RATNAPURA = 'RATNAPURA',
  KEGALLE = 'KEGALLE',
}

export enum CaregiverStatus {
  DRAFT = 'DRAFT', // profile not submitted yet
  SUBMITTED = 'SUBMITTED', // waiting admin review
  PENDING = 'PENDING', // waiting admin review
  APPROVED = 'APPROVED', // admin approved
  REJECTED = 'REJECTED', // rejected permanently
  CHANGES_REQUIRED = 'CHANGES_REQUIRED', // admin requested changes
}

export enum DocumentType {
  NIC = 'NIC',
  CERTIFICATE = 'CERTIFICATE',
  POLICE_REPORT = 'POLICE_REPORT',
  OTHER = 'OTHER',
}
