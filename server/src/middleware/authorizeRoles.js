import AppError from '../utils/AppError.js';

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 403));
  }

  next();
};

export default authorizeRoles;
