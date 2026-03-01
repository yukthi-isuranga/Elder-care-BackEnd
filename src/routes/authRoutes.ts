import { Router } from 'express';
import { registerController } from '../controllers/authController';
import { logInController } from '../controllers/loginControllers';

const router = Router();

//for SignUp
router.post('/register', registerController);

//for login
router.post('/login', logInController);

export default router;
