import express from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js';
import {
  getTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.patch('/:id/move', moveTask);
router.delete('/:id', deleteTask);

export default router;
