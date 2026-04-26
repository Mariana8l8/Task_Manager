import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { getJwtSecret } from '../utils/authToken.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const authenticateJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authorization token is required', 401);
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, getJwtSecret());
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(decoded.userId).select('username email role isActive');
  if (!user) {
    throw new AppError('User not found', 401);
  }

  if (!user.isActive) {
    throw new AppError('User account is blocked', 403);
  }

  req.userId = String(user._id);
  req.user = {
    id: String(user._id),
    username: user.username,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };

  next();
});

export default authenticateJWT;
