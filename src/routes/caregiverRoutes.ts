import { Router } from 'express';
import {
  caregiverController,
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
import { upload } from '../middlewares/upload';

const router = Router();

// Get Caregivers - No need of Token checking
router.get('/', caregiverController);

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
  upload.single('file'), // 👈 IMPORTANT
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
