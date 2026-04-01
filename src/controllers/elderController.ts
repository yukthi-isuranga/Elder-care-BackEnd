import { NextFunction, Request, Response } from 'express';
import { Elder } from '../types/elder';
import { User } from '../../prisma/generated/client';
import { prisma } from '../config/prisma';

interface CareTakerUserData extends Request {
  user?: User;
}

export const elderController = async (
  req: CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: Elder = await req.body;
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({ message: 'unauthorized access....!!!!' });
    }

    const careTaker = await prisma.caretaker.findUnique({
      where: { userId: user.id },
    });

    if (!careTaker) {
      return res
        .status(400)
        .json({ message: 'careTaker Profile Not Found...!!!' });
    }

    const elder = await prisma.elder.create({
      data: {
        caretakerId: careTaker.id,

        // Basic Identity
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        nic: data.nic,
        bloodGroup: data.bloodGroup,

        // Physical Information
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        mobilityLevel: data.mobilityLevel,
        visionIssues: data.visionIssues,
        hearingIssues: data.hearingIssues,

        // Medical Profile
        chronicDiseases: data.chronicDiseases,
        allergies: data.allergies,
        currentMedications: data.currentMedications,
        pastSurgeries: data.pastSurgeries,
        medicalNotes: data.medicalNotes,

        // Cognitive & Mental
        hasDementia: data.hasDementia,
        hasAlzheimer: data.hasAlzheimer,
        hasDepression: data.hasDepression,
        cognitiveNotes: data.cognitiveNotes,

        // Care Requirements
        requiresFullTimeCare: data.requiresFullTimeCare,
        requiresNightCare: data.requiresNightCare,
        requiresPhysiotherapy: data.requiresPhysiotherapy,
        requiresSpecialDiet: data.requiresSpecialDiet,
        specialNeeds: data.specialNeeds,

        // Risk & Monitoring
        fallRiskLevel: data.fallRiskLevel,
        requiresMonitoring: data.requiresMonitoring,

        // Emergency Info
        emergencyDoctorName: data.emergencyDoctorName,
        emergencyDoctorPhone: data.emergencyDoctorPhone,
        preferredHospital: data.preferredHospital,

        // System
        notes: data.notes,
      },
    });

    if (elder.id) {
      return res
        .status(200)
        .json({ message: 'Elder was Created Successfully...!!!', elder });
    } else {
      return res.status(400).json({ message: 'Elder was NOT Created...!!!' });
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

interface ElderParams {
  id: string;
}
export const elderUpdateController = async (
  req: Request<ElderParams> & CareTakerUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Headders are not found...!!!' });
    }
    const userFtomToken = req.user;
    const data = req.body;

    //Find CareTaker Using UserID
    const careTakerData = await prisma.caretaker.findUnique({
      where: {
        userId: userFtomToken.id,
      },
    });
    if (!careTakerData) {
      return res
        .status(400)
        .json({ message: 'CareTakerData Not Found...!!!', userFtomToken });
    }

    // Find Elder using CareTaker ID
    const elderData = await prisma.elder.findUnique({
      where: { caretakerId: careTakerData.id },
    });

    if (!elderData) {
      return res.status(400).json({ message: 'Elder is Not Found...!!!' });
    }

    if (careTakerData.id !== elderData.caretakerId) {
      return res
        .status(400)
        .json({ message: 'This is not Caretakes Elder Data...!!!' });
    }

    const updatedData = await prisma.elder.update({
      where: { id: elderData.id },
      data: data,
    });

    return res.status(200).json({
      message: `${elderData.firstName} Data Updated...!!!`,
      updatedData,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
