import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { User } from '../generated/prisma/client';

interface CustomData {
  userId: string;
}

interface CareGiverRequest extends Request {
  user?: User;
}
export const caregiverAuthMiddleware = async (
  req: CareGiverRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    token = req.cookies.jwtToken;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Unauthorized, Caretaker Token was not found...!!!' });
  }

  try {
    // Verify the token and extract the user ID
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as CustomData;
    const userId = decode.userId;

    //serch From DB and get User details
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User Not Found...!!!' });
    } else if (user.role != 'CAREGIVER') {
      return res.status(403).json({
        message: `${user.name} - ${user.email}, : Didnt have CAREGIVER access...!!!`,
      });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
