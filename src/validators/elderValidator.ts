import * as z from 'zod';
import {
  BloodGroup,
  Gender,
  MobilityLevel,
  RiskLevel,
} from '../generated/prisma/enums';

export const elderSchema = z.object({
  // -----------------------
  // Basic Identity
  // -----------------------
  firstName: z.string().min(1, 'First name is required'),
  middleName: z
    .string()
    .min(1, 'Middle name must more than 1 letter')
    .optional()
    .nullable(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(Gender, { error: 'Please select a valid gender' }),
  dateOfBirth: z.coerce.date({
    error: 'Invalid date of birth',
  }),
  nic: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => /^(\d{9}[VX]|\d{12})$/.test(val), {
      message: 'Invalid Sri Lankan NIC number',
    })
    .optional()
    .nullable(),
  bloodGroup: z
    .enum(BloodGroup, { error: 'Please select a valid BloodGroup' })
    .optional()
    .nullable(),

  // -----------------------
  // Physical Information
  // -----------------------
  heightCm: z
    .number({ error: 'Height must be a number' })
    .positive()
    .optional()
    .nullable(),
  weightKg: z
    .number({ error: 'Weight must be a number' })
    .positive()
    .optional()
    .nullable(),
  mobilityLevel: z.enum(MobilityLevel, 'Please select a valid MobilityLevel'),
  visionIssues: z
    .boolean({ error: 'visionIssues must be a boolean' })
    .optional(),
  hearingIssues: z
    .boolean({ error: 'hearingIssues must be a boolean' })
    .optional(),

  // -----------------------
  // Medical Profile
  // -----------------------
  chronicDiseases: z
    .string({ error: 'Error in chronicDiseases' })
    .optional()
    .nullable(),
  allergies: z
    .string({ error: 'Error in chronicDiseases' })
    .optional()
    .nullable(),
  currentMedications: z
    .string({ error: 'Error in currentMedications' })
    .optional()
    .nullable(),
  pastSurgeries: z
    .string({ error: 'Error in pastSurgeries' })
    .optional()
    .nullable(),
  medicalNotes: z
    .string({ error: 'Error in medicalNotes' })
    .optional()
    .nullable(),

  // -----------------------
  // Cognitive & Mental
  // -----------------------
  hasDementia: z.boolean({ error: 'hasDementia must be a boolean' }).optional(),
  hasAlzheimer: z
    .boolean({ error: 'hasAlzheimer must be a boolean' })
    .optional(),
  hasDepression: z
    .boolean({ error: 'hasDepression must be a boolean' })
    .optional(),
  cognitiveNotes: z
    .string({ error: 'Error in cognitiveNotes' })
    .optional()
    .nullable(),

  // -----------------------
  // Care Requirements
  // -----------------------
  requiresFullTimeCare: z
    .boolean({ error: 'requiresFullTimeCare must be a boolean' })
    .optional(),
  requiresNightCare: z
    .boolean({ error: 'requiresNightCare must be a boolean' })
    .optional(),
  requiresPhysiotherapy: z
    .boolean({ error: 'requiresPhysiotherapy must be a boolean' })
    .optional(),
  requiresSpecialDiet: z
    .boolean({ error: 'requiresSpecialDiet must be a boolean' })
    .optional(),
  specialNeeds: z
    .string({ error: 'Error in specialNeeds' })
    .optional()
    .nullable(),

  // -----------------------
  // Risk & Monitoring
  // -----------------------
  fallRiskLevel: z.enum(RiskLevel, {
    error: 'Please select a valid fallRiskLevel',
  }),
  requiresMonitoring: z
    .boolean({ error: 'requiresMonitoring must be a boolean' })
    .optional(),

  // -----------------------
  // Emergency Info
  // -----------------------
  emergencyDoctorName: z
    .string()
    .regex(
      /^(?:\+94|0)7[0-9]{8}$/,
      'Invalid Sri Lankan phone number, emergencyDoctorName',
    )
    .optional()
    .nullable(),
  // .string({ error: 'Error in emergencyDoctorName' })
  // .optional()
  // .nullable(),
  emergencyDoctorPhone: z
    .string()
    .regex(
      /^(?:\+94|0)7[0-9]{8}$/,
      'Invalid Sri Lankan phone number, emergencyDoctorPhone',
    )
    .optional()
    .nullable(),
  preferredHospital: z
    .string()
    .regex(
      /^(?:\+94|0)7[0-9]{8}$/,
      'Invalid Sri Lankan phone number, preferredHospital',
    )
    .optional()
    .nullable(),

  // -----------------------
  // System
  // -----------------------
  notes: z.string({ error: 'Error in notes' }).optional().nullable(),
});
