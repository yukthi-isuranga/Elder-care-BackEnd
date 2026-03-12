import { NextFunction, Request, Response } from 'express';
import { User } from '../generated/prisma/client';
import { CaretakerCreateRequest } from '../types/caretacker';
import { prisma } from '../config/prisma';

interface CareTakerUserData extends Request {
  user?: User;
}

export const caretakerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(201).json({ message: 'CARETAKER Route working....!!!!' });
  } catch (error) {
    next(error);
  }
};

// Get Caretaker Profile
export const getCaretakerProfile = async (
  req: CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const userData = req.user;

    // Security check
    if (userId !== userData?.id) {
      return res.status(403).json({ message: 'Unauthorized user detected' });
    }

    const profileData = await prisma.caretaker.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!profileData) {
      return res.status(404).json({ message: 'No user data found' });
    }

    return res.status(200).json({
      message: 'Caretaker profile fetched successfully',
      profileData,
    });
  } catch (error) {
    next(error);
  }
};

// Create Caretaker Profile
export const caretakerProfileController = async (
  req: CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CaretakerCreateRequest = req.body;
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ message: 'unauthorized access....!!!!' });
    }

    const caregiverProfile = await prisma.caretaker.create({
      data: {
        userId: user.id,

        // ======================
        // Personal Details
        // ======================
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nameWithInitials: data.nameWithInitials,
        nic: data.nic,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,

        // ======================
        // Contact Details
        // ======================
        phone: data.phone,
        secondaryPhone: data.secondaryPhone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        district: data.district,
        postalCode: data.postalCode,

        // ======================
        // Relationship
        // ======================
        relationshipToElder: data.relationshipToElder,
        relationshipTypeOther: data.relationshipToElder,

        isPrimaryContact: data.isPrimaryContact ?? true,

        // ======================
        // Emergency Contact
        // ======================
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        emergencyContactRelation: data.emergencyContactRelation,

        // ======================
        // System Fields
        // ======================
        notes: data.notes,

        // isVerified default = false (no need to set)
        // createdAt & updatedAt handled automatically
      },
    });

    if (caregiverProfile) {
      return res.status(200).json({
        message: 'Caretaker Profile Crates....!!!!',
        data: caregiverProfile,
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

export const editCareTakerProfileController = async (
  req: CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userdata = req.user;
    const data = req.body;

    // find and Update Caretaker Profile
    const careTakerData = await prisma.caretaker.update({
      where: { userId: userdata?.id },
      data,
    });

    if (!careTakerData) {
      return res
        .status(400)
        .json({ message: `${userdata?.name} - Data Not Updated....!!!` });
    } else
      return res.status(200).json({
        message: `${userdata?.name} - Updated Profile....!!!`,
        careTakerData,
      });
  } catch (error) {
    return res.status(400).json({ message: `${error} ` });
  }
};

// Bookings
export const bookingCaregiverController = async (
  req: CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;
    // const { caregiverId } = req.params;
    const body = req.body;

    const caretaker = await prisma.caretaker.findUnique({
      where: { userId: userData?.id },
    });

    if (!caretaker) {
      return res.status(403).json({
        message: 'Caretaker profile not found',
      });
    }
    // Prevent Booking in the Past
    if (new Date(body.startTime) < new Date()) {
      return res.status(400).json({
        message: 'Booking cannot start in the past',
      });
    }
    // Prevent Elder Double Care Sessions
    const elderOverlap = await prisma.booking.findFirst({
      where: {
        elderId: body.elderId,
        AND: [
          { endTime: { gt: new Date(body.startTime) } },
          { startTime: { lt: new Date(body.endTime) } },
        ],
      },
    });

    if (elderOverlap) {
      return res.status(400).json({
        message: 'Elder already has a booking during this time',
      });
    }
    // Checks time will overlaps
    const overlaps = await prisma.booking.findFirst({
      where: {
        caretakerId: caretaker.id,
        AND: [
          { endTime: { gt: new Date(body.startTime) } },
          { startTime: { lt: new Date(body.endTime) } },
        ],
      },
    });

    if (overlaps) {
      return res.status(400).json({
        message: 'Booking time overlaps with an existing booking',
      });
    }

    // Create Booking
    const bookingData = await prisma.booking.create({
      data: {
        caretakerId: caretaker.id,
        caregiverId: body.caregiverId,
        elderId: body.elderId,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        notes: body.notes,
      },
    });

    return res.status(201).json({
      message: `Booking created successfully`,
      bookingData,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
