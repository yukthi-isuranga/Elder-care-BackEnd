import { Router } from 'express';
import { caretakerController } from '../controllers/caretakerControllers';
import { caretakerAuthMiddleware } from '../middlewares/caretakerAuthMiddleware';

const router = Router();

router.use(caretakerAuthMiddleware);

router.get('/', caretakerController);

export default router;
