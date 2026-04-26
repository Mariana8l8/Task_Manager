import mongoose from 'mongoose';
import User from '../models/User.js';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

const ALLOWED_ROLES = ['user', 'admin'];

const ensureValidUserId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid user id', 400);
  }
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const listUsers = asyncHandler(async (req, res) => {
  const page = Number.parseInt(String(req.query.page || '1'), 10);
  const limit = Math.min(Number.parseInt(String(req.query.limit || '10'), 10), 50);
  const search = String(req.query.search || '').trim();

  if (Number.isNaN(page) || page < 1 || Number.isNaN(limit) || limit < 1) {
    throw new AppError('Invalid pagination params', 400);
  }

  const filter = {};
  if (search) {
    filter.$or = [
      { username: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    message: 'Users retrieved successfully',
    users: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidUserId(id);
  const user = await User.findById(id).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const tasksCount = await Task.countDocuments({ userId: user._id });

  res.status(200).json({
    message: 'User retrieved successfully',
    user: {
      ...sanitizeUser(user),
      tasksCount,
    },
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidUserId(id);
  const { role } = req.body;

  if (!ALLOWED_ROLES.includes(role)) {
    throw new AppError('Invalid role value', 400);
  }

  if (req.user.id === id && role !== 'admin') {
    throw new AppError('Admin cannot remove own admin role', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    message: 'User role updated successfully',
    user: sanitizeUser(user),
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidUserId(id);
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw new AppError('isActive must be a boolean', 400);
  }

  if (req.user.id === id && !isActive) {
    throw new AppError('Admin cannot deactivate own account', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    message: 'User status updated successfully',
    user: sanitizeUser(user),
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  ensureValidUserId(id);

  if (req.user.id === id) {
    throw new AppError('Admin cannot delete own account', 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  await Promise.all([
    User.findByIdAndDelete(id),
    Task.deleteMany({ userId: id }),
  ]);

  res.status(200).json({
    message: 'User deleted successfully',
  });
});

const getAdminStats = asyncHandler(async (req, res) => {
  const [usersCount, tasksCount, completedTasksCount, activeUsersCount] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ isCompleted: true }),
    User.countDocuments({ isActive: true }),
  ]);

  res.status(200).json({
    message: 'Admin statistics retrieved successfully',
    stats: {
      usersCount,
      activeUsersCount,
      tasksCount,
      completedTasksCount,
    },
  });
});

export {
  listUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAdminStats,
};
