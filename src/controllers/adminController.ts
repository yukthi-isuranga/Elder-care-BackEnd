import { NextFunction, Request, Response } from 'express';

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
