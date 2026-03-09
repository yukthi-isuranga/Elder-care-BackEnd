import { Router } from 'express';
import {
  getMeController,
  registerController,
} from '../controllers/authController';
import {
  logInController,
  logoutController,
} from '../controllers/loginControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Get User Data
router.get('/me', authMiddleware, getMeController);

//for SignUp
router.post('/register', registerController);

//for login
router.post('/login', logInController);

//for logout
router.post('/logout', logoutController);

export default router;
