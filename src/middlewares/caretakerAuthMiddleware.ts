import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { User } from '../generated/prisma/client';

interface CustomData {
  userId: string;
}

interface CareTakerRequest extends Request {
  user?: User;
}
export const caretakerAuthMiddleware = async (
  req: CareTakerRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwtToken) {
    token = req.cookies.jwtToken;
  }

  if (!token) {
    return res
      .status(404)
      .json({ message: 'Unauthorized, Caregiver Token was not found...!!!' });
  }

  try {
    // Verify the token and extract the user ID
    const decode = jwt.verify(token, process.env.JWT_SECRET!) as CustomData;
    const userId = decode.userId;

    //User serch from DB
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User Didnt exist in the DB...!!!' });
    } else if (user.role != 'CARETAKER') {
      return res.status(404).json({
        message: `${user.name} - ${user.email}, : Didnt have CARETAKER access...!!!`,
      });
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
