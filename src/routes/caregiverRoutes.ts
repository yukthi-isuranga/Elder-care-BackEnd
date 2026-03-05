import { Router } from 'express';
import {
  careGiverProfileController,
  EditcareGiverProfileController,
} from '../controllers/caregiverController';
import { caregiverAuthMiddleware } from '../middlewares/caregiverAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import {
  createCaregiverProfileSchema,
  editCaregiverProfileSchema,
} from '../validators/caregiverProfileValidator';

const router = Router();

router.use(caregiverAuthMiddleware);

// Create CareGiver Profile
router.post(
  '/profile',
  validateRequest(createCaregiverProfileSchema),
  careGiverProfileController,
);

// Edit CareGiver Profile
router.patch(
  '/profile',
  validateRequest(editCaregiverProfileSchema),
  EditcareGiverProfileController,
);

export default router;
