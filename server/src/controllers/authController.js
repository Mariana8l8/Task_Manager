import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { createAuthToken } from '../utils/authToken.js';

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});

const register = asyncHandler(async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    throw new AppError('All fields are required', 400);
  }

  if (password !== passwordConfirm) {
    throw new AppError('Passwords do not match', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedUsername = String(username).trim();

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  });

  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  const newUser = new User({
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role: 'user',
    isActive: true,
  });

  await newUser.save();

  const token = createAuthToken({
    userId: newUser._id,
    role: newUser.role,
  });

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: sanitizeUser(newUser),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('User account is blocked', 403);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = createAuthToken({
    userId: user._id,
    role: user.role,
  });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: sanitizeUser(user),
  });
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: 'Current user retrieved successfully',
    user: req.user,
  });
});

export { register, login, me };
