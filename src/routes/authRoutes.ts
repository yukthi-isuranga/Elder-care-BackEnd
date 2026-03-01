import { Router } from 'express';
import { registerController } from '../controllers/authController';
import {
  logInController,
  logoutController,
} from '../controllers/loginControllers';

const router = Router();

//for SignUp
router.post('/register', registerController);

//for login
router.post('/login', logInController);

//for logout
router.post('/logout', logoutController);

export default router;
