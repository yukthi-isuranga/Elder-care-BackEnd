import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set');
  if (!JWT_EXPIRES_IN) throw new Error('JWT_EXPIRES_IN is not set');

  const expiresIn: string = process.env.JWT_EXPIRES_IN!;

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn } as SignOptions);

  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
