// =======================================
// CREATE REQUEST
// =======================================

import { District, Gender, RelationshipType } from '../generated/prisma/enums';

export type CaretakerCreateRequest = {
  // Personal Details
  firstName: string;
  middleName?: string;
  lastName: string;
  nameWithInitials?: string;
  nic?: string;
  dateOfBirth?: string;
  gender: Gender;

  // Contact Details
  phone: string;
  secondaryPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: District;
  postalCode?: string;

  // Relationship
  relationshipToElder: RelationshipType;
  relationshipTypeOther?: string | null;
  isPrimaryContact?: boolean;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  notes?: string;
};
