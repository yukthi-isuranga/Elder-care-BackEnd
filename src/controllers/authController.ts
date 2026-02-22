import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';

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
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Use the hashed password instead of the plain text one
      role,
    },
  });

  res.json({ message: 'User registered successfully' });
};
