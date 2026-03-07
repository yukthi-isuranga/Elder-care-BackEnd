import { Router } from 'express';
import {
  bookingCaregiverController,
  caretakerController,
  caretakerProfileController,
  editCareTakerProfileController,
} from '../controllers/caretakerControllers';
import { caretakerAuthMiddleware } from '../middlewares/caretakerAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import {
  bookingsSchema,
  createCareTakerProfileSchema,
  editCareTakerProfileSchema,
} from '../validators/careTakerProfileValidators';
import {
  elderController,
  elderUpdateController,
} from '../controllers/elderController';
import {
  elderCreateSchema,
  elderUpdateSchema,
} from '../validators/elderValidator';

const router = Router();

router.use(caretakerAuthMiddleware);

router.get('/', caretakerController);

// Add CareTaker
router.post(
  '/profile',
  validateRequest(createCareTakerProfileSchema),
  caretakerProfileController,
);

//Edit CareTaker
router.patch(
  '/profile',
  validateRequest(editCareTakerProfileSchema),
  editCareTakerProfileController,
);

// Adding Elders
router.post('/elder', validateRequest(elderCreateSchema), elderController);

// Edit Elders
router.patch(
  '/elder',
  validateRequest(elderUpdateSchema),
  elderUpdateController,
);

// Caregiver Booking
router.post(
  '/booking/',
  validateRequest(bookingsSchema),
  bookingCaregiverController,
);

export default router;
