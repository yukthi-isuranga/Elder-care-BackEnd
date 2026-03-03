import { Router } from 'express';
import {
  caretakerController,
  caretakerProfileController,
} from '../controllers/caretakerControllers';
import { caretakerAuthMiddleware } from '../middlewares/caretakerAuthMiddleware';
import { validateRequest } from '../middlewares/validateRequests';
import { careTakerProfileSchema } from '../validators/careTakerProfileValidators';

const router = Router();

router.use(caretakerAuthMiddleware);

router.get('/', caretakerController);

//, validateRequest(careTakerProfileSchema)
router.post(
  '/profile',
  validateRequest(careTakerProfileSchema),
  caretakerProfileController,
);

export default router;
