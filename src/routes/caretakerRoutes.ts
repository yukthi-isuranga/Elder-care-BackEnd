import { Router } from 'express';
import {
  caretakerController,
  caretakerProfileController,
} from '../controllers/caretakerControllers';
import { caretakerAuthMiddleware } from '../middlewares/caretakerAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import { careTakerProfileSchema } from '../validators/careTakerProfileValidators';
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

//, validateRequest(careTakerProfileSchema)
router.post(
  '/profile',
  validateRequest(careTakerProfileSchema),
  caretakerProfileController,
);

// Adding Elders
router.post('/elder', validateRequest(elderCreateSchema), elderController);

// Edit Elders
router.patch(
  '/elder/:id',
  validateRequest(elderUpdateSchema),
  elderUpdateController,
);

export default router;
