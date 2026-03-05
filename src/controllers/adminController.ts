import { NextFunction, Request, Response } from 'express';
import { User } from '../generated/prisma/client';
import { prisma } from '../config/prisma';

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

interface AdminUserData extends Request {
  user?: User;
}

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
