import { NextFunction, Request, Response } from 'express';
import { CaregiverCreateRequest } from '../types/caregiver';
import { User } from '../generated/prisma/client';

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
  const data: CaregiverCreateRequest = req.body;

  // Extract logged-in user ID (assuming middleware adds it)
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  try {
    return res
      .status(201)
      .json({ message: 'CARETAKER Profile Route working....XoXo' });
  } catch (error) {
    next(error);
  }
};
