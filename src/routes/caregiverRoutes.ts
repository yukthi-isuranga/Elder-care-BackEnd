import { Router } from 'express';
import {
  caregiverController,
  caregiverDashboardController,
  careGiverProfileController,
  createCaregiverDocumentController,
  deleteCaregiverDocumentController,
  editcareGiverProfileController,
  getCaregiverDocumentController,
  getCaregiverProfileController,
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

// Get CareGiver Data. for dashbord. it checks profile, documents, and finally status. and return the status and a message to the frontend.
router.get('/dashboard', caregiverDashboardController);

// Edit CareGiver Profile
router.patch(
  '/profile',
  validateRequest(editCaregiverProfileSchema),
  editcareGiverProfileController,
);

// Get CareGiver Profile Detils
router.get('/profile', getCaregiverProfileController);

// Add CaregiverDocument
router.post(
  '/profile/document',
  upload.single('file'), // 👈 IMPORTANT
  validateRequest(careGiverDocumentSchema),
  createCaregiverDocumentController,
);

// Get CareGiver Documents
router.get('/profile/document', getCaregiverDocumentController);

// Delete CareGiver Document
router.delete(
  '/profile/document/:documentId',
  deleteCaregiverDocumentController,
);

// Submit For Approval
router.patch('/profile/submit', submitCareGiverProfileController);

export default router;
