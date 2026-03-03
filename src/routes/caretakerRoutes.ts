import { Router } from 'express';
import { caretakerController } from '../controllers/caretakerControllers';
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
  caretakerController,
);

export default router;
