import { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

const generateToken = (userId: string, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;
  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as StringValue;

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.cookie('jwtToken', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.APP_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
