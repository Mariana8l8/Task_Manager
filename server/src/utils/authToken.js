import jwt from 'jsonwebtoken';
import AppError from './AppError.js';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT secret is not configured', 500);
  }
  return process.env.JWT_SECRET;
};

const createAuthToken = ({ userId, role }) => jwt.sign(
  { userId, role },
  getJwtSecret(),
  { expiresIn: '7d' }
);

export { getJwtSecret, createAuthToken };
