import { NextFunction, Request, Response } from 'express';
import { User } from '../generated/prisma/client';
import { prisma } from '../config/prisma';
import { createCaregiverVersions } from '../services/versioningService';

interface ApprovalParams {
  approvalId: string;
}

interface AdminUserData extends Request {
  user?: User;
}

export const adminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(201).json({ message: 'Admin Works' });
  } catch (error) {
    return res.status(404).json({ message: 'Admin Not works' });
  }
};

export const adminGetAllCtController = async (
  req: AdminUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;

    const allCaraTakersData = await prisma.caretaker.findMany();

    if (!allCaraTakersData) {
      return res.status(400).json({ message: 'No data Found...' });
    }

    return res.status(200).json({
      message: `${userData?.name} -${userData?.email}  Admin Get all Caretakers....works....`,
      allCaraTakersData,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const adminGetAllCgController = async (
  req: AdminUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userData = req.user;

    const allCaraTakersData = await prisma.caregiver.findMany();

    if (!allCaraTakersData) {
      return res.status(400).json({ message: 'No data Found...' });
    }

    return res.status(200).json({
      message: `${userData?.name} -${userData?.email}  Admin Get all CareGivers....works....`,
      allCaraTakersData,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const adminGetAllCgApprovalsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allCaraTakersApprovalData = await prisma.caregiver.findMany({
      where: { status: 'SUBMITTED' },
    });

    if (!allCaraTakersApprovalData) {
      return res.status(400).json({ message: 'No data Found...' });
    }

    return res.status(200).json({
      message: `Admin Get all CareGivers Approvals....`,
      allCaraTakersApprovalData,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const adminGetCgApprovalController = async (
  req: AdminUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { approvalId } = req.params;

    const allCaraTakersApprovalData = await prisma.caregiver.findUnique({
      where: { id: approvalId.toString() },
    });

    if (!allCaraTakersApprovalData) {
      return res.status(400).json({ message: 'No data Found...' });
    }

    return res.status(200).json({
      message: `Admin Get all CareGivers Approvals....`,
      allCaraTakersApprovalData,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

// This will only do Approve. and update virsons
export const adminCgApprovalController = async (
  req: AdminUserData,
  res: Response,
  next: NextFunction,
) => {
  try {
    const adminData = req.user;

    const { approvalId } = req.params;

    const CaraTakerApprovalData = await prisma.caregiver.findUnique({
      where: { id: approvalId.toString() },
    });

    if (!CaraTakerApprovalData) {
      return res.status(400).json({ message: 'No data Found...', approvalId });
    }
    if (CaraTakerApprovalData.status !== 'SUBMITTED') {
      return res
        .status(400)
        .json({ message: 'Request was not Submitted Status...' });
    }

    // Time to APPROVE
    const approveData = await prisma.caregiver.update({
      where: { id: approvalId.toString() },
      data: {
        status: 'APPROVED',
        approvedById: adminData?.id,
        adminNote: `${adminData?.role} APPROVED`,
      },
    });

    if (!approveData) {
      return res.status(400).json({ message: 'Request was not Approved...' });
    }
    // First, get the last version number (if any)
    const versionData = await createCaregiverVersions(
      approvalId.toString(),
      approveData,
      approveData.status,
    );

    return res.status(200).json({
      message: `Admin Get all CareGivers Approvals....`,
      CaraTakerApprovalData,
      versionData,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
