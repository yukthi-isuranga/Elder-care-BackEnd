import { NextFunction, Request, Response } from 'express';
import { User } from '../../prisma/generated/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../config/prisma';

interface AuthRequest extends Request {
  user?: User;
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No token found' });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
