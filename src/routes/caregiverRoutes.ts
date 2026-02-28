import { Router } from 'express';
import { caregiverController } from '../controllers/caregiverController';
import { caregiverAuthMiddleware } from '../middlewares/caregiverAuthMiddleware';

const router = Router();

router.use(caregiverAuthMiddleware);

router.get('/', caregiverController);

export default router;
