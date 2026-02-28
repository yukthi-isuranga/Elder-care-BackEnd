import { NextFunction, Request, Response } from 'express';

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
