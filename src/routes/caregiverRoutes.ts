import { Router } from 'express';
import {
  careGiverProfileController,
  createCaregiverDocumentController,
  editcareGiverProfileController,
  submitCareGiverProfileController,
} from '../controllers/caregiverController';
import { caregiverAuthMiddleware } from '../middlewares/caregiverAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import {
  careGiverDocumentSchema,
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

// Add CaregiverDocument
router.post(
  '/profile/document',
  validateRequest(careGiverDocumentSchema),
  createCaregiverDocumentController,
);

// Edit CareGiver Profile
router.patch(
  '/profile',
  validateRequest(editCaregiverProfileSchema),
  editcareGiverProfileController,
);

// Submit For Approval
router.patch('/profile/submit', submitCareGiverProfileController);

export default router;
