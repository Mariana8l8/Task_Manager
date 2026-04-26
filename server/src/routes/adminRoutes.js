import express from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';
import authorizeRoles from '../middleware/authorizeRoles.js';
import {
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAdminStats,
} from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateJWT);
router.use(authorizeRoles('admin'));

router.get('/users', listUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);

export default router;
