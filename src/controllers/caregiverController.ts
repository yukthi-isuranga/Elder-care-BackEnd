import { Errback, NextFunction, Request, Response } from 'express';
import { CaregiverCreateRequest } from '../types/caregiver';
import { User } from '../generated/prisma/client';
import { prisma } from '../config/prisma';

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
        status: data.status,
        adminNote: data.adminNote,
        approvedById: data.approvedById,
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
