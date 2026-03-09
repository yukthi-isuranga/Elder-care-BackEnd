import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';

export const logInController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password, email } = req.body;

  //check user avalable in the DB
  const loginUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!loginUser) {
    return res.status(401).json({ message: 'User Not Found...!' });
  }

  // compare Password
  const matchPassword = await bcrypt.compare(password, loginUser.password);

  if (!matchPassword) {
    return res.status(400).json({ message: 'Invalid email or password...!!!' });
  }

  // Genarate Token for user
  const token = generateToken(loginUser.id, res);

  //remove password to send user
  const { password: _, ...userWithoutPassword } = loginUser;

  return res
    .status(200)
    .json({ message: 'Login successful', user: userWithoutPassword, token });
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.cookie('jwtToken', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    expires: new Date(0),
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
