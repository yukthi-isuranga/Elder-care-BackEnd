// types/caregiver.ts
export type CaregiverBasicInfo = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nameWithInitials?: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string; // ISO string
  nic: string;
  status: CaregiverStatus;
  adminNote: string;
  approvedById: string;
};

export type CaregiverProfessionalInfo = {
  experienceYears: number;
  bio?: string;
  hourlyRate?: number;
};

export type CaregiverAddress = {
  // line1: string;
  // line2?: string;
  address: string;
  district: District;
  // province: string;
  // postalCode?: string;
};

export type CaregiverDocument = {
  type: 'NIC' | 'CERTIFICATE' | 'POLICE_REPORT';
  fileUrl: string;
};

export type CaregiverCreateRequest = CaregiverBasicInfo &
  CaregiverProfessionalInfo &
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
  PENDING = 'PENDING', // waiting admin review
  APPROVED = 'APPROVED', // admin approved
  REJECTED = 'REJECTED', // rejected permanently
  CHANGES_REQUIRED = 'CHANGES_REQUIRED', // admin requested changes
}
