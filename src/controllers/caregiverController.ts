import { Errback, NextFunction, Request, Response } from 'express';
import { CaregiverCreateRequest } from '../types/caregiver';
import { User } from '../generated/prisma/client';
import { prisma } from '../config/prisma';
import { createCaregiverProfileSchema } from '../validators/caregiverProfileValidator';

interface CareGiverRequest extends Request {
  user?: User;
}

export const caregiverController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(201).json({ message: 'CAREGIVER Route Working.....!!!' });
  } catch (error) {
    next(error);
  }
};

export const careGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CaregiverCreateRequest = req.body;

    // Extract logged-in user ID (assuming middleware adds it)
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    //Create Caregiver Profile in DB
    const userProfile = await prisma.caregiver.create({
      data: {
        userId: userId,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nameWithInitials: data.nameWithInitials,
        phone: data.phone,
        nic: data.nic,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        district: data.district,
        experienceYears: data.experienceYears,
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        // status: data.status,
        adminNote: data.adminNote,
        approvedById: data.approvedById,

        // =============================
        // PROFESSIONAL DETAILS
        // =============================
        qualifications: data.qualifications, // NEW
        certifications: data.certifications, // NEW
        specialization: data.specialization, // NEW
        languagesSpoken: data.languagesSpoken, // NEW

        // =============================
        // SKILL FLAGS
        // =============================
        canHandleDementia: data.canHandleDementia ?? false, // NEW
        canHandleBedridden: data.canHandleBedridden ?? false, // NEW
        canHandleWheelchair: data.canHandleWheelchair ?? false, // NEW
        canProvidePhysiotherapy: data.canProvidePhysiotherapy ?? false, // NEW
        canAdministerMedication: data.canAdministerMedication ?? false, // NEW
        canHandleEmergency: data.canHandleEmergency ?? false, // NEW

        // =============================
        // AVAILABILITY
        // =============================
        isAvailable: data.isAvailable ?? true, // NEW
        availableFrom: data.availableFrom, // NEW
        availableTo: data.availableTo, // NEW
        availableForNight: data.availableForNight ?? false, // NEW
        availableForFullTime: data.availableForFullTime ?? false, // NEW

        // =============================
        // VERIFICATION & SAFETY
        // =============================
        isIdentityVerified: data.isIdentityVerified ?? false, // NEW
        isBackgroundChecked: data.isBackgroundChecked ?? false, // NEW
        backgroundCheckDate: data.backgroundCheckDate, // NEW
        emergencyContactName: data.emergencyContactName, // NEW
        emergencyContactPhone: data.emergencyContactPhone, // NEW

        // =============================
        // RATING & PERFORMANCE (admin controlled)
        // =============================
        averageRating: data.averageRating ?? 0, // NEW
        totalReviews: data.totalReviews ?? 0, // NEW
        totalCompletedJobs: data.totalCompletedJobs ?? 0, // NEW

        // =============================
        // SYSTEM
        // =============================
        isActive: data.isActive ?? true, // NEW
      },
    });

    if (!userProfile) {
      return res
        .status(400)
        .json({ message: 'CareGiver Profile Data creation Faild...!!!' });
    } else {
      return res.status(200).json({
        message: 'CareGiver Profile Successfully created...!!!',
        userProfile,
      });
    }
  } catch (error: any) {
    console.error(error);

    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({
        message: 'Caregiver profile already exists for this user',
      });
    }

    // Foreign key error
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Invalid user reference',
      });
    }

    next(error); // let global error handler handle the rest
  }
};

export const editcareGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    const data = req.body;

    if (!userData) return res.status(401).json({ message: 'Unauthorized' });

    //Update Caregiver data
    const caregiverData = await prisma.caregiver.update({
      where: { userId: userData.id },
      data,
    });
    if (caregiverData) {
      return res.status(200).json({
        message: 'CareGiver Profile Successfully Updated...!!!',
        caregiverData,
      });
    } else
      return res.status(400).json({
        message: 'CareGiver Profile Update Failed...!!!',
      });
  } catch (error) {
    return res.status(400).json({
      message: 'CareGiver Profile Update Failed...!!!',
      error,
    });
  }
};

export const submitCareGiverProfileController = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res.status(400).json({ message: 'User Data Not found....' });
    }
    // first checks for the profile
    const careGiverProfile = await prisma.caregiver.findUnique({
      where: { userId: userData.id },
    });

    if (!careGiverProfile) {
      return res
        .status(400)
        .json({ message: 'CareGiver Profile Not found....' });
    }

    // checks DB data with the Zod shema
    const validate = createCaregiverProfileSchema.safeParse(careGiverProfile);

    if (!validate.success) {
      return res.status(400).json({
        errors: validate.error.format(),
      });
    }

    // Update the Status of the Caregiver Profile
    const updateCgStatus = await prisma.caregiver.update({
      where: { userId: userData.id },
      data: { status: 'SUBMITTED' },
    });

    if (!updateCgStatus) {
      return res
        .status(400)
        .json({ message: 'Approval didnt Submitted...!!!' });
    }

    return res.status(200).json({
      message: 'Your Request was submitted to ADMIN...',
      updateCgStatus,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
