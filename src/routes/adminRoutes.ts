import { Router } from 'express';
import {
  adminCgApprovalController,
  adminController,
  adminGetAllCgApprovalsController,
  adminGetAllCgController,
  adminGetAllCtController,
  adminGetCgApprovalController,
  adminGetCgFullDataController,
} from '../controllers/adminController';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

router.use(adminMiddleware);

router.get('/', adminController);

// Todo [SCRUM-33]:  get all CareTaker profiles By admin
router.get('/caretakers', adminGetAllCtController);

// Todo [SCRUM-34] Get all Caregiver Profiles by Admin
router.get('/caregivers', adminGetAllCgController);

// Todo [SCRUM-35] Get All Approvals from Caregivers to Admin. Pending approvals
router.get('/caregivers/approvals', adminGetAllCgApprovalsController);

// Get Single approval details for Caregiver
router.get('/caregivers/approvals/:approvalId', adminGetCgFullDataController);

// // get Single approval
// router.get('/caregivers/approvals/:approvalId', adminGetCgApprovalController);

// Todo [SCRUM-36] PATCH /admin/caregivers/:id/approve
router.patch(
  '/caregivers/approvals/:approvalId/approve',
  adminCgApprovalController,
);

// Todo [SCRUM-37] PATCH /admin/caregivers/:id/reject

export default router;
