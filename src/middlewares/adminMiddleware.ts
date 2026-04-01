import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { User } from '../../prisma/generated/client';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

interface AdminRequest extends Request {
  user?: User;
}

export const adminMiddleware = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwtToken) {
    token = req.cookies.jwtToken;
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized, No Token Found...!' });
  }
  try {
    // Verify the token and extract the user ID
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as CustomJwtPayload;
    const userId = decoded.userId;

    // Fetch the user from the database using the extracted user ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, No User Found!' });
    } else if (user.role != 'ADMIN') {
      return res.status(401).json({
        message: `${user.name} - ${user.email} : Didnt have ADMIN access...!!!`,
      });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
