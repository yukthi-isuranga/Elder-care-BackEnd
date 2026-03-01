import { Router } from 'express';
import {
  caregiverController,
  careGiverProfileController,
} from '../controllers/caregiverController';
import { caregiverAuthMiddleware } from '../middlewares/caregiverAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import { caregiverProfileSchema } from '../validators/caregiverProfileValidator';

const router = Router();

router.use(caregiverAuthMiddleware);

// Create CareGiver Profile
router.post(
  '/profile',
  validateRequest(caregiverProfileSchema),
  careGiverProfileController,
);

router.get('/', caregiverController);

export default router;
