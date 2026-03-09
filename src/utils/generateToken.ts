import { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

const generateToken = (userId: string, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue;

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax', //  or 'none' if you want cross-origin cookies with secure:true in production
  });

  return token;
};

export default generateToken;
