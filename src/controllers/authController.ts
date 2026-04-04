import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/genarateToken';
import { User } from '../../prisma/generated/client';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password, role } = req.body;

  // Check User allready exists
  const userAvalable = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAvalable) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password before storing it in the database
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Use the hashed password instead of the plain text one
      role,
    },
  });

  // Generate JWT token and set it in the cookie

  const token = generateToken(newUser.id, res);

  res
    .status(201)
    .json({ status: 'User registered successfully', user: newUser, token });
};

interface UserDataReq extends Request {
  user?: User;
}

export const getMeController = async (req: UserDataReq, res: Response) => {
  const userId = req.user?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  res.json(user);
};
