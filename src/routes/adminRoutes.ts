import { Router } from 'express';
import {
  adminController,
  adminGetAllCgApprovalsController,
  adminGetAllCgController,
  adminGetAllCtController,
  adminGetCgApprovalController,
} from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', adminController);

// Todo [SCRUM-33]:  get all CareTaker profiles By admin
router.get('/caretakers', adminGetAllCtController);

// Todo [SCRUM-34] Get all Caregiver Profiles by Admin
router.get('/caregivers', adminGetAllCgController);

// Todo [SCRUM-35] Get All Approvals from Caregivers to Admin. Pending approvals
router.get('/caregivers/approvals', adminGetAllCgApprovalsController);

// get Single approval
router.get('/caregivers/approvals/:approvalId', adminGetCgApprovalController);

// Todo [SCRUM-36] PATCH /admin/caregivers/:id/approve

// Todo [SCRUM-37] PATCH /admin/caregivers/:id/reject

export default router;
