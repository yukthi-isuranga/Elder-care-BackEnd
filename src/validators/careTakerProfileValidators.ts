import * as z from 'zod';
import { District } from '../types/caregiver';
import { RelationshipType } from '../generated/prisma/enums';
import { dateOfBirthSchema } from './caregiverProfileValidator';

const careTakerProfileSchema = z.object({
  firstName: z.string().min(1, 'Fist name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  nameWithInitials: z.string().optional(),
  nic: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => /^(\d{9}[VX]|\d{12})$/.test(val), {
      message: 'Invalid Sri Lankan NIC number',
    }),
  dateOfBirth: dateOfBirthSchema,

  gender: z.enum(['MALE', 'FEMALE'], {
    error: 'Please select a valid gender',
  }),
  phone: z
    .string()
    .regex(/^(?:\+94|0)7[0-9]{8}$/, 'Invalid Sri Lankan phone number'),
  secondaryPhone: z
    .string()
    .regex(/^(?:\+94|0)7[0-9]{8}$/, 'Invalid Sri Lankan phone number')
    .optional(),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z
    .string()
    .min(1, 'Address line 2 must be more than 1 charactors.')
    .optional(),
  city: z.string().min(1, 'City is required.'),
  district: z.enum(District, {
    error: 'Please select a valid District',
  }),
  postalCode: z.string().min(1, 'Error in PostalCode.').optional(),
  relationshipToElder: z.enum(RelationshipType, {
    error: 'Please select a valid RelationshipType',
  }),
  relationshipTypeOther: z
    .string()
    .min(1, 'Error in RelationshipTypeOther.')
    .optional(),
  isPrimaryContact: z.boolean({
    error: 'isPrimaryContact must be true or false',
  }),
  emergencyContactName: z
    .string()
    .min(1, 'Error in CmergencyContactName')
    .optional(),
  emergencyContactPhone: z
    .string()
    .regex(/^(?:\+94|0)7[0-9]{8}$/, 'Invalid EmergencyContactPhone number')
    .optional(),
  emergencyContactRelation: z
    .string()
    .min(1, 'Error in emergencyContactRelation')
    .optional(),
  isVerified: z.boolean({
    error: 'isVerified must be true or false',
  }),
  notes: z.string().min(1, 'Error in Notes').optional(),
});

export const createCareTakerProfileSchema = careTakerProfileSchema;

export const editCareTakerProfileSchema = careTakerProfileSchema.partial();
