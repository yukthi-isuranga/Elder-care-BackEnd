import { Router } from 'express';
import {
  adminController,
  adminGetAllCtController,
} from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', adminController);

// Todo [SCRUM-33]:  get all CareTaker profiles By admin
router.get('/caretakers', adminGetAllCtController);

// Todo [SCRUM-34] Get all Caregiver Profiles by Admin

// Todo [SCRUM-35] Get All Approvals from Caregivers to Admin

export default router;
