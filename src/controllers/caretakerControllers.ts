import { NextFunction, Request, Response } from 'express';

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
