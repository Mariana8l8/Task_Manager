import mongoose from 'mongoose';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import {
  normalizeOptionalString,
  requireNonEmptyTitle,
  validateMoveDirection,
} from '../utils/taskValidation.js';

const ensureValidTaskId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid task id', 400);
  }
};

const normalizeUserTaskPositions = async (userId) => {
  const tasks = await Task.find({ userId }).sort({ position: 1, createdAt: 1 });
  const updates = [];

  tasks.forEach((task, index) => {
    const updateSet = {};

    if (task.position !== index) {
      updateSet.position = index;
      task.position = index;
    }

    if (typeof task.isCompleted !== 'boolean') {
      updateSet.isCompleted = false;
      task.isCompleted = false;
    }

    if (Object.keys(updateSet).length > 0) {
      updates.push({
        updateOne: {
          filter: { _id: task._id },
          update: { $set: { ...updateSet, updatedAt: new Date() } },
        },
      });
    }
  });

  if (updates.length > 0) {
    await Task.bulkWrite(updates);
  }
};

const getTasks = asyncHandler(async (req, res) => {
  const userId = req.userId;

  await normalizeUserTaskPositions(userId);
  const tasks = await Task.find({ userId }).sort({ position: 1, createdAt: 1 });

  res.status(200).json({
    message: 'Tasks retrieved successfully',
    tasks,
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  const normalizedTitle = requireNonEmptyTitle(title);

  const lastTask = await Task.findOne({ userId }).sort({ position: -1, createdAt: -1 });
  const nextPosition = lastTask ? lastTask.position + 1 : 0;

  const newTask = new Task({
    title: normalizedTitle,
    description: normalizeOptionalString(description) ?? '',
    isCompleted: false,
    position: nextPosition,
    userId,
  });

  await newTask.save();

  res.status(201).json({
    message: 'Task created successfully',
    task: newTask,
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidTaskId(id);
  const userId = req.userId;
  const { title, description, isCompleted } = req.body;

  const task = await Task.findById(id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId.toString() !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  if (title !== undefined) {
    const normalizedTitle = requireNonEmptyTitle(title);
    task.title = normalizedTitle;
  }

  if (description !== undefined) {
    task.description = normalizeOptionalString(description) ?? '';
  }

  if (isCompleted !== undefined) {
    if (typeof isCompleted !== 'boolean') {
      throw new AppError('isCompleted must be a boolean', 400);
    }
    task.isCompleted = isCompleted;
  }

  task.updatedAt = new Date();
  await task.save();

  res.status(200).json({
    message: 'Task updated successfully',
    task,
  });
});

const moveTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidTaskId(id);
  const userId = req.userId;
  const { direction } = req.body;

  validateMoveDirection(direction);
  await normalizeUserTaskPositions(userId);

  const task = await Task.findOne({ _id: id, userId });
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const neighborQuery = direction === 'up'
    ? { userId, position: { $lt: task.position } }
    : { userId, position: { $gt: task.position } };

  const neighborSort = direction === 'up' ? { position: -1 } : { position: 1 };
  const neighbor = await Task.findOne(neighborQuery).sort(neighborSort);

  if (!neighbor) {
    return res.status(200).json({
      message: `Task is already at the ${direction === 'up' ? 'top' : 'bottom'}`,
      task,
    });
  }

  const taskPosition = task.position;
  const neighborPosition = neighbor.position;
  const now = new Date();

  await Task.bulkWrite([
    {
      updateOne: {
        filter: { _id: task._id, userId },
        update: { $set: { position: neighborPosition, updatedAt: now } },
      },
    },
    {
      updateOne: {
        filter: { _id: neighbor._id, userId },
        update: { $set: { position: taskPosition, updatedAt: now } },
      },
    },
  ]);

  const [updatedTask, updatedNeighbor] = await Promise.all([
    Task.findById(task._id),
    Task.findById(neighbor._id),
  ]);

  res.status(200).json({
    message: 'Task moved successfully',
    task: updatedTask,
    swappedTask: updatedNeighbor,
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidTaskId(id);
  const userId = req.userId;

  const task = await Task.findById(id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  if (task.userId.toString() !== userId) {
    throw new AppError('Unauthorized', 403);
  }

  await Task.findByIdAndDelete(id);
  await normalizeUserTaskPositions(userId);

  res.status(200).json({
    message: 'Task deleted successfully',
  });
});

export { getTasks, createTask, updateTask, moveTask, deleteTask };
