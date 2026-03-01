import { z } from 'zod';
import { District, CaregiverStatus } from '../types/caregiver';

export const dateOfBirthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid date',
  })
  .refine((date) => date < new Date(), {
    message: 'Date of birth must be in the past',
  })
  .refine(
    (date) => {
      const today = new Date();

      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < date.getDate())
      ) {
        age--;
      }

      return age >= 18;
    },
    {
      message: 'User must be at least 18 years old',
    },
  );

export const caregiverProfileSchema = z.object({
  firstName: z.string(),
  middleName: z.string().optional(),
  lastName: z.string(),
  nameWithInitials: z.string().optional(),
  phone: z
    .string()
    .regex(/^(?:\+94|0)7[0-9]{8}$/, 'Invalid Sri Lankan phone number'),
  nic: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .refine((val) => /^(\d{9}[VX]|\d{12})$/.test(val), {
      message: 'Invalid Sri Lankan NIC number',
    }),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: dateOfBirthSchema,
  address: z.string(),
  district: z.enum(District, { error: 'Please select a valid district' }),
  experienceYears: z
    .number()
    .min(0, { message: 'Experience cannot be negative' })
    .max(60, { message: 'Experience cannot exceed 60 years' }),
  bio: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  status: z.enum(CaregiverStatus, { error: 'Please select a valid status' }),
  adminNote: z.string().optional(),
  approvedById: z.string().optional(),
});
